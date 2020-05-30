import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@tonyknvu/common';

export default async () => {
  //Do the check right before connect to the database so JWT_KEY always defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
};
