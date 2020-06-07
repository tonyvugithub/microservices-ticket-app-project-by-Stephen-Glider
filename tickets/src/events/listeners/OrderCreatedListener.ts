import { Listener, OrderCreatedEvent, Subjects } from '@tonyknvu/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName.ticketsService;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    //If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    //Maybe have another check here checking if ticket is reserved

    //Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });
    //Save the ticket
    await ticket.save();
    //Now client is protected so it can be accessed through derived class
    //You need this publisher to update the ticket version in orders service when an order created
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    //Ack the message
    msg.ack();
  }
}
