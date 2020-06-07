import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/orders';
import { OrderStatus } from '@tonyknvu/common/build';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';

it('returns 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'thisIsAToken',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns 401 when purchasing an order that does not belong to the user', async () => {
  //This order was created by a different userId
  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  //The request to pay was made by another userId
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'thisIsAToken',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  //If user who owns the order make the request to a cancelled order, throws 400 error
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'thisIsAToken',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 10000);
  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });
  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('cad');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});
