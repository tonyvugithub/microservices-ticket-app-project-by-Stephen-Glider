import { Application } from 'express';
import { NotFoundError } from '@tonyknvu/common';
import { deleteOrderRouter } from '../routes/deletOrder';
import { getOrderRouter } from '../routes/getOrder';
import { getOrdersRouter } from '../routes/getOrders';
import { createOrderRouter } from '../routes/newOrder';

export default (app: Application) => {
  app.use(createOrderRouter);
  app.use(getOrderRouter);
  app.use(getOrdersRouter);
  app.use(deleteOrderRouter);
  app.all('*', () => {
    throw new NotFoundError();
  });
};
