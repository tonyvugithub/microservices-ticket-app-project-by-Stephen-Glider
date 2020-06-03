import { Application } from 'express';
import { NotFoundError } from '@tonyknvu/common';
import { createTicketRouter } from '../routes/newTicket';
import { getTicketRouter } from '../routes/getTicket';
import { getTicketsRouter } from '../routes/getTickets';
import { updateTicketRouter } from '../routes/updateTicket';

export default (app: Application) => {
  app.use(createTicketRouter);
  app.use(getTicketRouter);
  app.use(getTicketsRouter);
  app.use(updateTicketRouter);
  app.all('*', () => {
    throw new NotFoundError();
  });
};
