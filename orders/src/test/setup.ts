import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

//Tell Jest to mock nats-wrapper, using the one in __mocks__ directory
//Do it in setup.ts so it can be applied widely to all test files
jest.mock('../nats-wrapper');

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
  //To clear all mocks before each test
  jest.clearAllMocks();
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

//We need to fake the cookie (setting it manually) instead of going through the signup
//as in the auth service
global.signin = () => {
  //Build a JWT payload. {id, email}
  const payload = {
    //Random generate the userId to sumulate different users
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  //Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session Object. { jwt: MY_JWT}
  const session = { jwt: token };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //Return a strings that is the cookie with the encoded data
  //This structure is how the cookie got return to browser
  //[] is because of required from supertest
  return [`express:sess=${base64}==; path=/; secure; httponly`];
};
