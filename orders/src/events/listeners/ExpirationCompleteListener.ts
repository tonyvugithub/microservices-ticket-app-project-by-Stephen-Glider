import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from '@tonyknvu/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/OrderCancelledPublisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName.ordersService;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    //Find associated order
    const order = await Order.findById(data.orderId).populate('ticket');

    //If not order found, throw Error
    if (!order) {
      throw new Error('Order not found');
    }

    //This check make sure that we don't accidentally cancel the status of a complete order
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    //Set the status of the order to cancel due to expiration,
    //We don't need to set ticket property to null as we would need to that to call isReserved() method on specific ticket
    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
