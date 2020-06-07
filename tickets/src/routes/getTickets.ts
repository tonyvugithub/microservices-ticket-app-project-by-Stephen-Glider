import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  //Only return the ticket that is not reserved aka does not have an orderId property
  const tickets = await Ticket.find({ orderId: undefined });
  res.send(tickets);
});

export { router as getTicketsRouter };
