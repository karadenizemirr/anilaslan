import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SessionService {
  getSession(req: Request): any {
    return req.session;
  }

  setSessionValue(req: Request, key: string, value: any): void {
    req.session[key] = value;
  }

  getSessionValue(req: Request, key: string): any {
    return req.session[key];
  }

  deleteSessionValue(req: Request, key: string): void {
    delete req.session[key];
  }

  destroySession(req: Request): void {
    
  }
}
