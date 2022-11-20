import { Request, Response } from 'express';
import { hash, salt } from '../../../utils/crypto';
import db from '../../../utils/db';
import generateNonConflictingTag from '../../../utils/generateNonConflictingTag';
import generateToken from '../../../utils/generateToken';

export default async (req: Request, res: Response) => {
  try {
    const trimmedAndLoweredEmail = String(req.body.email || '').trim().toLowerCase();
    const trimmedUsername = String(req.body.username || '').trim();
    const trimmedPassword = String(req.body.password || '').trim();

    if (!trimmedAndLoweredEmail) {
      res.status(400).json({
        message: 'Email not set',
        payload: null,
      });
      return;
    }
    if (!trimmedUsername) {
      res.status(400).json({
        message: 'Username not set',
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

    if (trimmedUsername.length < 2 || trimmedUsername.length > 32) {
      res.status(400).json({
        message:
          'Username must be more than or equal to 2 characters and less than or equal to 32 characters',
        payload: null,
      });
      return;
    }
    if (trimmedPassword.length < 8 || trimmedPassword.length > 64) {
      res.status(400).json({
        message:
          'Password must be more than or equal to 8 characters and less than or equal to 64 characters',
        payload: null,
      });
      return;
    }

    if (
      (
        await db.user.findMany({
          where: {
            username: trimmedUsername,
          },
        })
      ).length > 456969
    ) {
      res.status(400).json({
        message: 'Too many people are using the same username',
        payload: null,
      });
      return;
    }

    const tag = await generateNonConflictingTag(trimmedUsername);
    const token = generateToken(64);

    const user = await db.user.create({
      data: {
        email: trimmedAndLoweredEmail,
        username: trimmedUsername,
        tag,
        password: hash(salt(trimmedPassword)),
        token,
      },
    });

    res.status(201).json({
      message: 'Created account',
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
