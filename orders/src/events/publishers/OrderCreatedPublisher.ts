import { Publisher, OrderCreatedEvent, Subjects } from '@tonyknvu/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
