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
      payload: {
        id: user.id,
        email: user.email,
        username: user.username,
        tag: user.tag,
        badges: JSON.parse(user.badges),
        createdAt: user.createdAt,
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
