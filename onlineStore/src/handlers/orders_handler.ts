import express from 'express';
import { OrderStore } from '../models/orders_model';
import jwt from 'jsonwebtoken';

export enum status {
  active = 'active',
  completed = 'completed',
  shipped = 'shipped',
}

export type order = {
  id?: number;
  userid: number;
  status: status;
};

const order_store = new OrderStore();

export const show = async (req: express.Request, res: express.Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch {
    res.status(401);
    res.json(`error: invalid token`);
    return;
  }

  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400);
    res.json('id should be number!');
    return;
  }

  let order: order | null;
  try {
    order = await order_store.show(id);
    if (!order) {
      res.status(400);
      res.json('order not found');
    }
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

export const create = async (req: express.Request, res: express.Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`error: invalid token ${err}`);
    return;
  }

  if (!req.body.status || !req.body.userid) {
    res.status(400);
    res.json('status and userid are required');
    return;
  }

  const order = {
    userid: req.body.userid,
    status: req.body.status,
  };

  try {
    const newOrder = await order_store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

export const addProductToOrder = async (
  req: express.Request,
  res: express.Response,
) => {
  /* verify token */
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`error: invalid token ${err}`);
    return;
  }

  const orderId = Number(req.params.orderId);
  const productId = Number(req.params.productId);
  const quantity = Number(req.params.quantity);
  if (isNaN(quantity) || isNaN(productId) || isNaN(orderId)) {
    res.status(400);
    res.json('id should be number!');
    return;
  }
  let order: order | null;

  /* check if order exists */
  try {
    order = await order_store.show(orderId);
    if (!order) {
      res.status(404);
      res.json('order not found');
      return;
    }
  } catch (err) {
    res.status(400);
    res.json(err);
    return;
  }

  if (order.status !== 'active') {
    res.status(400);
    res.json('order is not active');
    return;
  }

  if (quantity <= 0) {
    res.status(400);
    res.json('quantity must be greater than 0');
    return;
  }

  /* add product to the existing order */
  try {
    const newOrder = await order_store.addProductToOrder(
      orderId,
      productId,
      quantity,
    );
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const order_route = (app: express.Application) => {
  app.get('/orders/:id', show);
  app.post('/orders', create);
  app.post('/orders/:orderId/products/:productId/:quantity', addProductToOrder);
};

export default order_route;
