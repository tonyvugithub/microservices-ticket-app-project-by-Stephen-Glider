import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@tonyknvu/common';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    //If there is no order, throw NotFoundError
    if (!order) {
      throw new NotFoundError();
    }

    //If some user try to access an order that is not belonged to that user
    if (order.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as getOrderRouter };
