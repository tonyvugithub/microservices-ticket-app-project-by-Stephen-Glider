import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  //Create a ticket with ticket model
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const userCookie = global.signin();
  //Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  //Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(204);

  //Expectation to make sure the order is cancelled
  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  //Create a ticket with ticket model
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const userCookie = global.signin();
  //Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  //Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
