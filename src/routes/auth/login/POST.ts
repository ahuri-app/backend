import { Request, Response } from 'express';
import { hash, salt } from '../../../utils/crypto';
import db from '../../../utils/db';

export default async (req: Request, res: Response) => {
  try {
    const trimmedAndLoweredEmail = String(req.body.email || '').trim().toLowerCase();
    const trimmedPassword = String(req.body.password || '').trim();

    if (!trimmedAndLoweredEmail) {
      res.status(400).json({
        message: 'Email not set',
        payload: null,
      });
      return;
    }
    if (!trimmedPassword) {
      res.status(400).json({
        message: 'Password not set',
        payload: null,
      });
      return;
    }

    const user = await db.user.findFirst({
      where: {
        email: trimmedAndLoweredEmail,
        password: hash(salt(trimmedPassword)),
      },
    });

    if (!user) {
      res.status(401).json({
        message: 'Incorrect credentials',
        payload: null,
      });
      return;
    }

    res.status(200).json({
      message: 'Success',
      payload: {
        id: user.id,
        email: user.email,
        username: user.username,
        tag: user.tag,
        token: user.token,
      },
    });
  } catch {
    res.status(500).json({
      message: 'Internal server error',
      payload: null,
    });
  }
};
