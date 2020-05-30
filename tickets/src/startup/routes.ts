import { Application } from 'express';
import { NotFoundError } from '@tonyknvu/common';
import { createTicketRouter } from '../routes/newTicket';
import { showTicketRouter } from '../routes/showTicket';
import { showTicketsRouter } from '../routes/showTickets';
import { updateTicketRouter } from '../routes/updateTicket';

export default (app: Application) => {
  app.use(createTicketRouter);
  app.use(showTicketRouter);
  app.use(showTicketsRouter);
  app.use(updateTicketRouter);
  app.all('*', () => {
    throw new NotFoundError();
  });
};
