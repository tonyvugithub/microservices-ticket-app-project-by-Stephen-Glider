import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@tonyknvu/common';
import { generateJWT } from '../helpers/jwt';
import { User } from '../models/User';

const router = express.Router();

const signUpValidator = () => [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 character'),
];

router.post(
  '/api/users/signup',
  [...signUpValidator(), validateRequest],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    //Check if the user already existed, if it is then throw an BadRequestError
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email has already been used');
    }

    //If it is valid then hash the password and save user
    const user = User.build({ email, password });
    await user.save();

    //Generate JWT and store in session
    generateJWT(user, req);

    res.status(201).send(user);
  }
);

export { router as signupRouter };
