import { Request, Response } from 'express';
import User from '../models/UserModel';
import { MissingFieldError, BadRequestError } from './errorController';

export async function create(req: Request, res: Response) {
  if (!req.body.username) {
    throw new MissingFieldError('username');
  }

  if (!req.body.password) {
    throw new MissingFieldError('password');
  }

  const normalizedUsername = req.body.username.trim();
  const isUsernameAvailable = await User.isUsernameAvailable(normalizedUsername);
  if (!isUsernameAvailable) {
    throw new BadRequestError('Username not available');
  }

  const user = await User.query().insert({
    username: normalizedUsername,
    password: req.body.password
  } as any);

  res.send(user);
}

export async function get(_req: Request, res: Response) {
  const data = await User.query();
  res.send(data);
}
