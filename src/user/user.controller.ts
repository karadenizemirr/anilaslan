import { Body, Controller, Get, Param, Post, Render, Req, Res, Session, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { FastifyReply, FastifyRequest } from 'fastify';
import * as secureSession from '@fastify/secure-session'
import { AdminAuthGuard } from "src/auth/admin-auth/admin-auth.guard";

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
    async register(@Body() bodyData:any, @Res() res:FastifyReply){

        const response =await this.userService.createUser(bodyData)

        if (response.message === 'success'){
            return res.redirect(302,'/')
        }
    }

    @Post('update/:id')
    update(@Body() bodyData:any, @Param() id:string, @Res() res:FastifyReply){

        this.userService.updateUser(id['id'], bodyData)
        return res.redirect(302, `/user/profile/edit/${id}`)
    }

    @Post('admin/update/:id')
    @UseGuards(AdminAuthGuard)
    adminUpdate(@Body() bodyData:any, @Param() id:string, @Res() res:FastifyReply){

        this.userService.updateUser(id['id'], bodyData)
        return res.redirect(302, `/user/profile/edit/${id}`)
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
            
            if (_login.role === 'user'){
                res.redirect(302, '/work')
            }else if(_login.role === 'admin'){
                res.redirect(302, '/user/admin/home')
            }
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
    @UseGuards(AdminAuthGuard)
    @Render('admin/user')
    async adminGetAllUSer(){
        const users =await this.userService.getAllUser()
        
        return {users, role: 'admin', title: 'Kullanıcı İşlemleri'}
    }

    @Get('admin/delete/:id')
    @UseGuards(AdminAuthGuard)
    adminDeleteUser(@Param() id:string, @Res() res:FastifyReply): void{
        this.userService.deleteUser(id['id'])
        res.redirect(302, 'admin/user')
    }

    @Get('admin/detail/:id')
    @UseGuards(AdminAuthGuard)
    @Render('admin/user-detail')
    async adminUserDetail(@Param() id:string){
        const user = await this.userService.getUserById(id['id'])
        return {user}
    }

    @Get('profile/:id')
    @Render('home/profile')
    async getUserProfile(
        @Param() id:string
    ){
        
        const works = await this.userService.getUserWorks(id['id'])
        const apporoved =await this.userService.getUserApporoved(id['id'])
        const user = await this.userService.getUserById(id['id'])

        return {title: 'Profilim', works, apporoved, user,role: 'user'}
    }
    @Get('profile/edit/:id')
    @Render('home/profile-edit')
    async editUserProfile(
        @Param() id:string
    ){
        const user = await this.userService.getUserById(id['id'])

        return {title: 'Profilimi Düzenle', user, role: 'user'}
    }

    // User Add
    @Post('admin/add') 
    @UseGuards(AdminAuthGuard)
    async addUserWithAdmin(@Body() bodyData:any, @Res()res: FastifyReply){
        const create = await this.userService.createUser(bodyData)
        res.redirect(302, '/user/admin')
        return create
    }

    // Admin Home
    @Get('admin/home')
    @UseGuards(AdminAuthGuard)
    @Render('admin/home')
    async getAdminHome(){
        return {title: 'Yönetici Paneli', role: 'admin'}
    }
}
