import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@tonyknvu/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName.ordersService; //This listener is inside the orders service
  //Trigger when received a message/events from NATS
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    //Pull the title and price properties from data
    const { id, title, price } = data;
    //Create a new ticket in local databse inside orders service
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
