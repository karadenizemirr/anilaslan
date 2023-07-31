import { Body, Controller, Get, Param, Post, Render, Res, Session, UseGuards } from "@nestjs/common";
import { WorkService } from "./work.service";
import {FastifyReply} from 'fastify'
import * as secureSession from '@fastify/secure-session'
import { JwtService } from "src/customService/jwt.service";
import { UserAuthGuard } from "src/auth/user-auth/user-auth.guard";
import { AdminAuthGuard } from "src/auth/admin-auth/admin-auth.guard";
import { UserAuth } from "src/auth/user-auth/user-auth.decorator";
@Controller('work')
@UseGuards(UserAuthGuard, AdminAuthGuard)
export class WorkController {
    role:string
    constructor(private readonly workService: WorkService, private readonly jwtService: JwtService) {
        this.role = "user"
    }

    @UserAuth('non-user')
    @Post('add')
    addWork(@Body() bodyData:any, @Res() res:FastifyReply){
        
        res.redirect(302, 'admin/work')
        return this.workService.addWork(bodyData)
    }

    @Get('add')
    @UserAuth('non-user')
    @Render('admin/work')
    async getAddWork(){
        const items = await this.workService.getWorks()
        return {title: 'İşler', items}
    }

    @Get('admin/detail/:id')
    @UserAuth('non-user')
    @Render('admin/work-detail')
    async getAdminWorkDetail(@Param() id:string){
        const work = await this.workService.getWorkById(id['id'])
        
        return {title: 'İş Detayı',work: work, users: work.data.users}
    }
    
    @Get('/')
    @Render('home/works')
    @UserAuth('user')
    async getWorks(@Session() session:secureSession.Session) {
      const items = await this.workService.getWorks();
    
      const token = session.get('token')    
      const parse_token = this.jwtService.verifyToken(token)
      const userId = parse_token['id']


      return { items, title: "İş Ara" , role:this.role, userId};
    }

    // Search Operations
    @Post('search')
    async searchWork(@Body() bodyData: any, @Res() res:FastifyReply){
        const items = await this.workService.searchWork(bodyData['keyword'])
        
        res.redirect(302, '/work')
        return {items}
    }

    // User Application
    @Get('application/:id')
    @UserAuth('user')
    async application(
        @Session() session: secureSession.Session,
        @Param() workId: string,
        @Res() res:FastifyReply
    ){

        const token = session.get('token')
        const parse_token = this.jwtService.verifyToken(token)

        const userId = parse_token['id']

        this.workService.getApplication(userId['userId'], workId['id'])
        res.redirect(302, '/work')
        
    }

    @Get('admin/apporeved/:id/:userId')
    @UserAuth('non-user')
    async apporovedJop(
        @Param() workId:string,
        @Session() session: secureSession.Session,
        @Res() res:FastifyReply
    ){

        this.workService.apporevedJops(workId['userId'], workId['id'])
        res.redirect(302, '/work/add')
        
    }
}