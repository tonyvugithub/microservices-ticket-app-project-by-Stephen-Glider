import { scrypt, randomBytes } from 'crypto';
//promisify help to change scrypt from callback base to promise so we can use async/await
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
export class Password {
  //static function is private to the class and can be accessed through the class
  //eg: Password.toHash(..);
  static async hash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    //Save both the hashed password and the salt
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}

//If using bcrypt
//import bcrypt from 'bcrypt'

/* 
static async hash(password: string) {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(password, salt);
  
  return hashed;
} 

static async compare(storedPassword: string, suppliedPassword: string) {
  return await bcrypt.compare(suppliedPassword, storePassword);
}
*/
