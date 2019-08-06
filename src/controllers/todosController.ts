import { Request, Response } from 'express';
import Todo from '../models/TodoModel';
import { MissingFieldError, BadRequestError } from './errorController';

export async function create(req: Request, res: Response) {
  if (!req.body.title) {
    throw new MissingFieldError('title');
  }

  const query = await Todo.query().insert({
    title: req.body.title
  } as any);

  res.send(query);
}

export async function get(req: Request, res: Response) {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const data = await Todo.query().offset((page - 1) * limit).limit(limit);
  res.send(data);
}

export async function find(req: Request, res: Response) {
  if (!req.params.id) {
    throw new MissingFieldError('id');
  }

  if (!Number.isInteger(req.params.id)) {
    throw new BadRequestError('Invalid id');
  }

  const data = await Todo.query().findById(req.params.id);
  res.send(data);
}

export async function update(req: Request, res: Response) {
  if (!req.params.id) {
    throw new MissingFieldError('id');
  }

  if (!Number.isInteger(req.params.id)) {
    throw new BadRequestError('Invalid id');
  }

  const updateData = {} as any;
  if (req.body.title) {
    updateData.title = req.body.title;
  }

  if (typeof req.body.isDone !== 'undefined') {
    updateData.is_done = req.body.isDone;
  }

  await Todo.query().findById(req.params.id).update(updateData);
  res.sendStatus(202);
}

export async function remove(req: Request, res: Response) {
  if (!req.params.id) {
    throw new MissingFieldError('id');
  }

  if (!Number.isInteger(req.params.id)) {
    throw new BadRequestError('Invalid id');
  }

  await Todo.query().deleteById(req.params.id);

  res.sendStatus(202);
}
