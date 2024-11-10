import express from 'express';
import bodyParser from 'body-parser';
import user_route from './handlers/users_handler';
import product_route from './handlers/products_handler';
import order_route from './handlers/orders_handler';

const app: express.Application = express();
const address: string = '3000';

app.use(bodyParser.json());

user_route(app);
product_route(app);
order_route(app);

app.listen(3000, function () {
  console.log(`Server is running on http://localhost:${address}`);
});

export default app;
