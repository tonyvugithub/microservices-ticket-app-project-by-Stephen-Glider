import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@tonyknvu/common';
import { OrderCreatedListener } from '../OrderCreatedListener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  //Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });
  await ticket.save();

  //Create fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'dasca', //userId is not used here so no need to be a valid one
    expiresAt: 'dasca', //expiresAt is not used here so no need to be a valid one
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //create fake message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  //Check to see if the updated ticket has the orderId property the same as the event data id property
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  //@ts-ignore
  //Display the whole array of event information be published
  console.log(natsWrapper.client.publish.mock.calls[0][1]);

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
