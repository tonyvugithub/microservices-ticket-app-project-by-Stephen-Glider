import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

//To augment properties in Express Request type
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Check if there is a jwt
  //Add ? for TS. Equivalent to !req.session || !req.session.jwt
  if (!req.session?.jwt) {
    return next();
  }
  //If there is, extract the payload
  try {
    const payload = (await jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    )) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
