import mongoose from 'mongoose';
import { Password } from '../helpers/password';

// An interface that describe the properties that required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

//An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An interface that describes the properties that a User Document has
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  id?: string;
}

//Create user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

//This function helps TS involve in the process of checking the properties
//coming from new User
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//This callback function will run right before we save a document
//Use function keyword to access this object
userSchema.pre('save', async function (done) {
  //Check if password is changed
  if (this.isModified('password')) {
    const hashed = await Password.hash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
