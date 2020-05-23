import mongoose from 'mongoose';
import { DatabaseConnectionError } from '../errors/database-connect-error';

export default async () => {
  //Do the check right before connect to the database so JWT_KEY always defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
};
