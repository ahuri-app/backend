import { Request, Response } from 'express';
import db from '../../../../utils/db';
import getCurrentDateFormatted from '../../../../utils/getCurrentDateFormatted';

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
    });

    if (!channel) {
      res.status(404).json({
        message: 'Channel not found',
        payload: null,
      });
      return;
    }

    const trimmedMessage = String(req.body.content || '').trim();

    if (!trimmedMessage) {
      res.status(400).json({
        message: 'Message content is not set or empty',
        payload: null,
      });
      return;
    }

    if (trimmedMessage.length > 2000) {
      res.status(400).json({
        message: 'Message content is over the 2000 characters limit',
        payload: null,
      });
      return;
    }

    const message = await db.message.create({
      data: {
        content: trimmedMessage,
        senderId: user.id,
        channelId: channel.id,
        createdAt: getCurrentDateFormatted(),
      },
      select: {
        id: true,
        sender: {
          select: {
            id: true,
            username: true,
            tag: true,
            badges: true,
            createdAt: true,
          },
        },
        channel: {
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
            createdAt: true,
          },
        },
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      message: 'Sent message',
      payload: message,
    });
  } catch {
    res.status(500).json({
      message: 'Internal server error',
      payload: null,
    });
  }
};
