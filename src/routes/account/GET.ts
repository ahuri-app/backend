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
        id: true,
        email: true,
        username: true,
        tag: true,
        badges: true,
        createdAt: true,
        token: true,
      },
    });

    if (!user) {
      res.status(401).json({
        message: 'Invalid token',
        payload: null,
      });
      return;
    }

    res.json({
      message: 'Success',
      payload: user,
    });
  } catch {
    res.status(500).json({
      message: 'Internal server error',
      payload: null,
    });
  }
};
