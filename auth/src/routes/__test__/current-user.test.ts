import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  /* const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201); */

  //Because in Test environment, cookie is not handled automatically, so we need to manual extract it
  //const cookie = authResponse.get('Set-Cookie');

  //get the cookie from the signin() global function set in setup.ts
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    //set the cookie to the header
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    //set the cookie to the header
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
