import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizingController {
  async index(req, res) {
    const meetups = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gte]: new Date(),
            },
          },
          order: ['date'],
          include: [{ model: File, attributes: ['id', 'path', 'url'] }],
        },
      ],
    });

    return res.json(meetups);
  }
}

export default new OrganizingController();
