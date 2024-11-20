import express from 'express';
import { ProductStore, product } from '../models/products_model';
import jwt from 'jsonwebtoken';

const product_store = new ProductStore();

const index = async (req: express.Request, res: express.Response) => {
  try {
    const products = await product_store.index();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: express.Request, res: express.Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400);
    res.json('id should be number!');
    return;
  }

  try {
    const product = await product_store.show(id);
    if (!product) {
      res.status(400);
      res.json('product not found');
    }
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: express.Request, res: express.Response) => {
  const product: product = {
    name: req.body.name,
    price: req.body.price,
  };

  if (!product.name || !product.price) {
    res.status(400);
    res.json('name and price are required');
    return;
  }

  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`error: invalid token ${err}`);
    return;
  }

  try {
    const newProduct = await product_store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const product_route = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
};

export default product_route;
