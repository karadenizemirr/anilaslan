import { Controller, Get, Render, Req, Session, UseGuards } from '@nestjs/common';
import * as secureSession from '@fastify/secure-session'
import { FastifyRequest } from 'fastify';
import { UserAuthGuard } from './auth/user-auth/user-auth.guard';
import { AdminAuthGuard } from './auth/admin-auth/admin-auth.guard';
import { UserAuth } from './auth/user-auth/user-auth.decorator';

@Controller()
@UseGuards(UserAuthGuard, AdminAuthGuard)
export class AppController {
  constructor() {}

  @Get()
  @Render('home/index')
  @UserAuth('non-user')
  getHello(
    @Session() session: secureSession.Session,
    @Req() request: FastifyRequest
  ) {
    return {title: "Anasayfa"}
  }
}
