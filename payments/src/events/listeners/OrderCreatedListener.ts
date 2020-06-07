import { Listener, Subjects, OrderCreatedEvent } from '@tonyknvu/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = await Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      userId: data.userId,
      price: data.ticket.price,
    });

    await order.save();

    msg.ack();
  }
}
