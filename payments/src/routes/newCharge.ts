import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@tonyknvu/common';
import { stripe } from '../stripe';
import { Order } from '../models/orders';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers/PaymentCreatedPublisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const paymentValidator = () => [
  body('token').not().isEmpty().withMessage('Token is required'),
  body('orderId').not().isEmpty().withMessage('orderId is required'),
];

router.post(
  '/api/payments',
  requireAuth,
  paymentValidator(),
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    //Check if there is an order
    if (!order) {
      throw new NotFoundError();
    }

    //Check if the user who owns the other is the current user
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    //Check if the order status has not changed to CANCELLED
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Your order has expired. cannot pay');
    }

    //Create a charge to send to Stripe API
    const charge = await stripe.charges.create({
      currency: 'cad',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
