import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { secureSession } from 'fastify-secure-session';
import { JwtService } from 'src/customService/jwt.service';
import { Reflector } from '@nestjs/core';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService, private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as secureSession.Session;
    const token = session['token'];
  
    // Token değeri varsa, diğer yetkilendirme kontrollerini yapabilirsiniz.
    if (token) {
      const parse_token = this.jwtService.verifyToken(token);
      const roles = this.reflector.get<string>('auth', context.getHandler());
      const response = context.switchToHttp().getResponse();
  
      if (!roles) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
  
      if (parse_token.role === roles[0]) {
        return true;
      } else if (roles[0] === 'not-user') {
        response.redirect('/work');
        return false;
      } else {
        response.redirect('/');
        return false;
      }
    }
  
    // Token değeri yoksa, guard verilmemiş sayfaların açılmasını sağlayabilirsiniz.
    const allowedPages = ['/', '/register', '/work/add']; // Guard verilmemiş sayfaların yolunu buraya ekleyin
  
    const requestUrl = request.url;
    if (allowedPages.includes(requestUrl)) {
      return true;
    }
  
    // Token yok ve guard verilmemiş sayfalar dışında bir sayfa talep edildiğinde
    // kullanıcıyı başka bir sayfaya yönlendirebilir veya hata fırlatabilirsiniz.
    const response = context.switchToHttp().getResponse();
    response.redirect('/');
    return false;
  }
}
