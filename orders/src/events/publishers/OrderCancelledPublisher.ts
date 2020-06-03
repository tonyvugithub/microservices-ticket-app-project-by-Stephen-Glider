import { Publisher, OrderCancelledEvent, Subjects } from '@tonyknvu/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
