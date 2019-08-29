import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: File, attributes: ['id', 'path', 'url'] },
      ],
    });

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to your own meetup" });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't subscribe to past meetup" });
    }

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res.status(400).json({
        error: "Can't subscribe to two or more meetups at the same time",
      });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    return res.json(subscription);
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    return res.json();
  }
}

export default new SubscriptionController();
