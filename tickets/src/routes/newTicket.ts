import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@tonyknvu/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

const newTicketValidator = () => [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];
//This route require to have the user logged in to access
router.post(
  '/api/tickets',
  requireAuth,
  newTicketValidator(),
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      //To tell TS that req.currentUser for sure defined as we already pass the requireAuth middleware to reach here
      userId: req.currentUser!.id,
    });

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
