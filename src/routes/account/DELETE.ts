import { Request, Response } from 'express';
import db from '../../utils/db';

export default async (req: Request, res: Response) => {
  try {
    if (!req.headers.authorization) {
      res.status(400).json({
        message:
          'There is no Authorization header, please set it to a valid token',
        payload: null,
      });
      return;
    }

    const user = await db.user.findFirst({
      where: {
        token: req.headers.authorization,
      },
      select: {
        messages: true,
        channels: true,
        id: true,
        username: true,
        tag: true,
        badges: true,
        createdAt: true,
        email: true,
      },
    });

    if (!user) {
      res.status(401).json({
        message: 'Invalid token',
        payload: null,
      });
      return;
    }

    for (let i = 0; i < user.messages.length; i++)
      await db.message.delete({
        where: {
          id: user.messages[i].id,
        },
      });

    for (let i = 0; i < user.channels.length; i++)
      await db.channel.delete({
        where: {
          id: user.channels[i].id,
        },
      });

    await db.user.delete({
      where: {
        token: req.headers.authorization,
      },
    });

    res.json({
      message: 'Deleted account',
      payload: {
        id: user.id,
        email: user.email,
        username: user.username,
        tag: user.tag,
        badges: user.badges,
        createdAt: user.createdAt,
      },
    });
  } catch {
    res.status(500).json({
      message: 'Internal server error',
      payload: null,
    });
  }
};
