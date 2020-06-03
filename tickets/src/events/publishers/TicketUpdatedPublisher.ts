import { Publisher, Subjects, TicketUpdatedEvent } from '@tonyknvu/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
