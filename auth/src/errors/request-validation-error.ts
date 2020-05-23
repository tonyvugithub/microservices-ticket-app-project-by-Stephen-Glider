import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

//Option #1 to watch for type in TS code
/* interface CustomError {
  statusCode: number;
  serializeErrors(): {
    message: string;
    field?: string;
  }[];
} */

//export class RequestValidationError extends Error implements CustomError {

//Option #2: use CustomError Abstract Class
export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    //Because we are extending a built in class, we need this line
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  //To create the array of errors
  serializeErrors() {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }
}
