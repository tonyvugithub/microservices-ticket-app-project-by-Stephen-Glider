import { Publisher, Subjects, TicketCreatedEvent } from '@tonyknvu/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
