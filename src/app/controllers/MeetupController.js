import * as Yup from 'yup';
import { isBefore, parseISO, startOfHour } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const user_id = req.userId;

    const meetups = await Meetup.findAll({
      where: {
        user_id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: 'Meetup date is invalid' });
    }

    const hourStart = startOfHour(parseISO(date));

    const checkTimeAvailability = await Meetup.findOne({
      where: {
        date: hourStart,
      },
    });

    if (checkTimeAvailability) {
      return res
        .status(401)
        .json({ error: 'Meetup date/hour is not availabe' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user_id = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.past) {
      return res.status(400).json({ error: "Can't update the past meetup" });
    }

    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const { date } = req.body;
    const hourStart = startOfHour(parseISO(date));

    const checkTimeAvailability = await Meetup.findOne({
      where: {
        date: hourStart,
      },
    });

    if (checkTimeAvailability) {
      return res
        .status(401)
        .json({ error: 'Meetup date/hour is not availabe' });
    }

    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: 'Meetup date is invalid' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {}
}

export default new MeetupController();
