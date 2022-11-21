import { Request, Response } from 'express';
import db from '../../../utils/db';

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
    });

    if (!user) {
      res.status(401).json({
        message: 'Invalid token',
        payload: null,
      });
      return;
    }

    const channel = await db.channel.findFirst({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        name: true,
        owner: {
          select: {
            id: true,
            username: true,
            tag: true,
            badges: true,
            createdAt: true,
          },
        },
        messages: {
          select: {
            sender: {
              select: {
                id: true,
                username: true,
                tag: true,
                badges: true,
                createdAt: true,
              },
            },
            content: true,
            sentAt: true,
          },
        },
        createdAt: true,
      },
    });

    if (!channel) {
      res.status(404).json({
        message: 'Channel not found',
        payload: null,
      });
      return;
    }

    res.json({
      message: 'Success',
      payload: channel,
    });
  } catch {
    res.status(500).json({
      message: 'Internal server error',
      payload: null,
    });
  }
};
