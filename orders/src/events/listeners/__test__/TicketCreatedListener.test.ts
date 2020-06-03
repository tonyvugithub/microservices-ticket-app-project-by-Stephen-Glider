import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@tonyknvu/common';
import { TicketCreatedListener } from '../TicketCreatedListener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  //Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  //Create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket when receive a ticket:created event from NATS', async () => {
  //Need these for the listener process to work
  const { listener, data, msg } = await setup();
  //Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  //Write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  //Call the onMessage function with the data object + message object
  //write assertions to make sure ack function is called
});
