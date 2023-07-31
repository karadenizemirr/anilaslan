import { Controller, Get, Render, Req, Session, UseGuards } from '@nestjs/common';
import * as secureSession from '@fastify/secure-session'
import { AuthGuard } from './auth/auth.guard';
import { Auth } from './auth/auth.decorator';
import { FastifyRequest } from 'fastify';

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  constructor() {}

  @Get()
  @Auth('not-user')
  @Render('home/index')
  getHello(
    @Session() session: secureSession.Session,
    @Req() request: FastifyRequest
  ) {
    return {title: "Anasayfa"}
  }
}
