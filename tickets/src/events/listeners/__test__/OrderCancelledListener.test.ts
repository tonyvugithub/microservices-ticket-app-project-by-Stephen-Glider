import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@tonyknvu/common';
import { OrderCancelledListener } from '../OrderCancelledListener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  //Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  //Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });
  const orderId = mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  await ticket.save();

  //Create fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //create fake message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, orderId, msg };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, data, orderId, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
