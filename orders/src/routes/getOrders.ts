import express, { Request, Response } from 'express';
import { requireAuth } from '@tonyknvu/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  //.populate('ticket') is to tell mongoose to load up the ticket associate with them as well rather than just the ref ticketid
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  res.send(orders);
});

export { router as getOrdersRouter };
