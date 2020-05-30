import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { User } from '../models/User';
import { validateRequest, BadRequestError } from '@tonyknvu/common';
import { generateJWT } from '../helpers/jwt';
import { Password } from '../helpers/password';

const router = express.Router();

const signinValidator = () => [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password'),
];
router.post(
  '/api/users/signin',
  [...signinValidator(), validateRequest],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }
    const passwordsAreMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsAreMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    //Generate JWT and store in session object
    generateJWT(existingUser, req);

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
