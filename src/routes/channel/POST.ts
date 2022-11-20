import { Request, Response } from 'express';
import db from '../../utils/db';
import generateEid from '../../utils/generateEid';

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

    const eid = generateEid();

    await db.channel.create({
      data: {
        eid,
        name: trimmedChannelName,
        ownerId: user.id,
        ownerEid: user.eid,
      },
    });

    res.status(201).json({
      message: 'Created channel',
      payload: {
        id: eid,
        name: trimmedChannelName,
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
