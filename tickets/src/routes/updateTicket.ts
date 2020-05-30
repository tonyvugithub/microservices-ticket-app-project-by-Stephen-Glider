import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import {
  NotFoundError,
  NotAuthorizedError,
  validateRequest,
  requireAuth,
} from '@tonyknvu/common';

const router = express.Router();

const updateTicketValidator = () => [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be provided and must be greater than 0'),
];

router.put(
  '/api/tickets/:id',
  requireAuth,
  updateTicketValidator(),
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
