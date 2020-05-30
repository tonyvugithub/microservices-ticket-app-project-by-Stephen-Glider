import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongo: any;
//This is a hook function, this function will run before All of our tests starts execute
beforeAll(async () => {
  //Create a copy in memory of mongo
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

//Run this right before each test starts
beforeEach(async () => {
  //The test module does not have access to process.env.JWT_KEY as we set this in Kubernetes
  process.env.JWT_KEY = 'secret';
  //Get all the collections currently in the database
  const collections = await mongoose.connection.db.collections();
  //Loop through all collections and delete them
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

//Run this after all tests finish to stop the server and close the connection
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
