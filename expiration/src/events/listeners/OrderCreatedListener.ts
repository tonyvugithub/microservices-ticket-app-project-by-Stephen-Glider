import { Listener, OrderCreatedEvent, Subjects } from '@tonyknvu/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //Find the interval of time that the ticket is valid of
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log(`Waiting ${delay} milliseconds to process the job`);

    //When an order:created event is received by expiration service, the Queue will create a new job to send to Redis
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    );

    msg.ack();
  }
}
