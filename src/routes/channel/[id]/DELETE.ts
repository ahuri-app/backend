import { Request, Response } from 'express';
import db from '../../../utils/db';

export default async (req: Request, res: Response) => {
  try {
    const trimmedToken = String(req.headers.authorization || '').trim();
    if (!trimmedToken) {
      res.status(400).json({
        message:
          'There is no Authorization header, please set it to a valid token',
        payload: null,
      });
      return;
    }

    const user = await db.user.findFirst({
      where: {
        token: trimmedToken,
      },
      select: {
        channels: true,
        id: true,
        username: true,
        tag: true,
        badges: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(401).json({
        message: 'Invalid token',
        payload: null,
      });
      return;
    }

    for (let i = 0; i < user.channels.length; i++)
      if (user.channels[i].id === req.params.id) {
        await db.channel.delete({
          where: {
            id: req.params.id,
          },
        });
        res.json({
          message: 'Deleted channel',
          payload: {
            id: user.channels[i].id,
            name: user.channels[i].name,
            owner: {
              id: user.id,
              username: user.username,
              tag: user.tag,
              badges: user.badges,
              createdAt: user.createdAt,
            },
            createdAt: user.channels[i].createdAt,
          },
        });
        return;
      }

    res.status(403).json({
      message: 'You do not own this channel',
      payload: null,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Internal server error',
      payload: null,
    });
  }
};
