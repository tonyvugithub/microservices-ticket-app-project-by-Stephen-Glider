//Helper to create JWT and cookie
import { Request } from 'express';
import jwt from 'jsonwebtoken';

//For TS
import { UserDoc } from '../models/User';

export const generateJWT = (user: UserDoc, req: Request) => {
  //Generate JWT
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    //The ! is to tell TS that we ensure JWT_KEY is defined
    process.env.JWT_KEY!
  );

  //Store it on session object
  req.session = {
    jwt: userJwt,
  };
};
