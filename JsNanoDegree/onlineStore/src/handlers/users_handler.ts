import express from 'express';
import { UserStore, user } from '../models/users_model';
import jwt from 'jsonwebtoken';

const user_store = new UserStore();

const index = async (req: express.Request, res: express.Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`error: invalid token ${err}`);
    return;
  }
  try {
    const users = await user_store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: express.Request, res: express.Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`error: invalid token ${err}`);
    return;
  }

  if (req.params.id === '0') {
    res.status(400);
    res.json('id is required');
    return;
  }

  const id = Number(req.params.id);
  try {
    const user = await user_store.show(id);
    if (!user) {
      res.status(400);
      res.json('user not found');
    }
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: express.Request, res: express.Response) => {
  const user: user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  };

  if (!user.firstname || !user.lastname || !user.password) {
    res.status(400);
    res.json('firstname, lastname and password are required');
    return;
  }

  try {
    const newUser = await user_store.create(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as string,
    );
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const user_route = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/userID/:id', show);
  app.post('/users', create);
};
export default user_route;
