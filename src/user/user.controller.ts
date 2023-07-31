import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Render, Req, Res, Session } from "@nestjs/common";
import { UserService } from "./user.service";
import { Response } from "express";
import { FastifyReply, FastifyRequest } from 'fastify';
import * as secureSession from '@fastify/secure-session'

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Get('register')
    @Render('home/register')
    getRegister(){
        return {title: 'Kayıt Ol'}
    }

    @Post('register')
    async register(@Body() bodyData:any, @Res() res:Response){

        const response =await this.userService.createUser(bodyData)

        if (response.message === 'success'){
            return res.redirect('/')
        }

        return res.redirect('/user/register')
    }

    @Post('update/:id')
    update(@Body() bodyData:any, @Param() id:string){
        return this.userService.updateUser(id['id'], bodyData)
    }

    @Get('/:id')
    getUserById(@Param() id:string){
        return this.userService.getUserById(id['id'])
    }


    @Post('login')
    async login(
        @Body() bodyData:any, 
        @Res() res:FastifyReply, 
        @Req() req:FastifyRequest,
        @Session() session: secureSession.Session
        ){
        const _login = await this.userService.login(bodyData.email, bodyData.password)
        
        if (_login){
            session.set('token', _login.token)
            res.redirect(302, '/work')
        }
    }

    @Get('logout')
    async logout(
        @Session() session: secureSession.Session,
        @Res() res:FastifyReply
    ){

        session.delete()
        res.redirect(302, '/')
    }

    // Admin Controllers
    @Get('admin/')
    @Render('admin/user')
    async adminGetAllUSer(){
        const users =await this.userService.getAllUser()
        
        return {users}
    }

    @Get('admin/delete/:id')
    adminDeleteUser(@Param() id:string, @Res() res:FastifyReply): void{
        this.userService.deleteUser(id['id'])
        res.redirect(302, 'admin/user')
    }

    @Get('admin/detail/:id')
    @Render('admin/user-detail')
    async adminUserDetail(@Param() id:string){
        const user = await this.userService.getUserById(id['id'])
        return {user}
    }
}
