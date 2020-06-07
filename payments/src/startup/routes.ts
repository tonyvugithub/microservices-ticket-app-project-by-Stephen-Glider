import { Application } from 'express';
import { NotFoundError } from '@tonyknvu/common';
import { createChargeRouter } from '../routes/newCharge';

export default (app: Application) => {
  app.use(createChargeRouter);
  app.all('*', () => {
    throw new NotFoundError();
  });
};
