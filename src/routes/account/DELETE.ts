import { Request, Response } from 'express';
import db from '../../utils/db';

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
        messages: true,
        channels: true,
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
        token: trimmedToken,
      },
    });

    res.json({
      message: 'Success',
      payload: null,
    });
  } catch {
    res.status(500).json({
      message: 'Internal server error',
      payload: null,
    });
  }
};
