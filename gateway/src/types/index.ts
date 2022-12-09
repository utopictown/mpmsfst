import { Request } from 'express';

interface AppRequest extends Request {
  userId: string;
}

export { AppRequest };
