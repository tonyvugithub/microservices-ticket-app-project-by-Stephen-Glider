//Abstract CustomError class (similar to OOP)
export abstract class CustomError extends Error {
  abstract statusCode: number;

  //Pass a default message for logging purposes
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
