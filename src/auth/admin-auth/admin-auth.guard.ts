import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { secureSession } from 'fastify-secure-session';
import { JwtService } from 'src/customService/jwt.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(private reflector: Reflector, private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles = this.reflector.get<string>('user-auth', context.getHandler())
    const request = context.switchToHttp().getRequest()
    const token = request.session as secureSession.Session

    if (token && token['token']){
      const parsed_token = this.jwtService.verifyToken(token['token'])

      if (parsed_token.role === 'admin'){
        return true
      }else{
        return false
      }
    }

    return false
  }
}