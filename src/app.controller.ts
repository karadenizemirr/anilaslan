import { Controller, Get, Render, Req, Session, UseGuards } from '@nestjs/common';
import * as secureSession from '@fastify/secure-session'
import { FastifyRequest } from 'fastify';

@Controller()
export class AppController {
  role:boolean = false

  constructor() {}

  @Get()
  @Render('home/index')
  getHello(
    @Session() session: secureSession.Session,
    @Req() request: FastifyRequest
  ) {
    const token = session['token']
    
    if (token){
      this.role = true
    }
    return {title: "Anasayfa"}
  }
}
