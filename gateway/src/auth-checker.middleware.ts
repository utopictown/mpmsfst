import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppService } from './app.service';
import { AppRequest } from './types';

@Injectable()
export class AuthCheckerMiddleware implements NestMiddleware {
  constructor(private readonly appService: AppService) {}

  async use(req: AppRequest, res: Response, next: NextFunction) {
    const userId = await this.appService.checkAuth(req);
    if (!userId) throw new UnauthorizedException();
    req.userId = userId;
    next();
  }
}
