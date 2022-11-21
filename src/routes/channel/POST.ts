import { Request, Response } from 'express';
import db from '../../utils/db';
import getCurrentDateFormatted from '../../utils/getCurrentDateFormatted';

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

    const trimmedChannelName = String(req.body.channelName || '').trim();

    if (!trimmedChannelName) {
      res.status(400).json({
        message: 'Channel name is not set',
        payload: null,
      });
      return;
    }

    if (trimmedChannelName.length > 64) {
      res.status(400).json({
        message:
          'Channel name must have at least 1 character and have less than or equal to 64 characters',
        payload: null,
      });
      return;
    }

    const createdAt = getCurrentDateFormatted();

    const channel = await db.channel.create({
      data: {
        name: trimmedChannelName,
        ownerId: user.id,
        createdAt,
      },
    });

    res.status(201).json({
      message: 'Created channel',
      payload: {
        id: channel.id,
        name: channel.name,
        createdAt,
        messages: [],
        owner: user,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Internal server error',
      payload: null,
    });
  }
};
