import { Application } from 'express';
import { currentUserRouter } from '../routes/current-user';
import { signinRouter } from '../routes/signin';
import { signupRouter } from '../routes/signup';
import { signoutRouter } from '../routes/signout';
import { NotFoundError } from '@tonyknvu/common';

export default (app: Application) => {
  app.use(currentUserRouter);
  app.use(signinRouter);
  app.use(signoutRouter);
  app.use(signupRouter);

  //404 Route, unknow routes after checking all valid routes above
  //app.all is for all kinds of request
  app.all('*', () => {
    throw new NotFoundError();
  });
};
