import { Body, Controller, Get, Post, Render, Res, UseGuards } from "@nestjs/common";
import { WorkService } from "./work.service";
import { AuthGuard } from "src/auth/auth.guard";
import {FastifyReply} from 'fastify'
import { Auth } from "src/auth/auth.decorator";

@Controller('work')
@UseGuards(AuthGuard)
export class WorkController {
    role:string
    constructor(private readonly workService: WorkService) {
        this.role = "user"
    }

    @Post('add')
    addWork(@Body() bodyData:any){

        return this.workService.addWork(bodyData)
    }

    @Get('add')
    @Render('admin/work')
    getAddWork(){
        return {title: 'İş Ekle'}
    }
        
    @Get('/')
    @Auth('user')
    @Render('home/works')
    async getWorks() {
      const items = await this.workService.getWorks();
      return { items, title: "İş Ara" , role:this.role};
    }

    // Search Operations
    @Post('search')
    @Auth('user')
    async searchWork(@Body() bodyData: any, @Res() res:FastifyReply){
        const items = await this.workService.searchWork(bodyData['keyword'])
        
        res.redirect(302, '/work')
        return {items}
    }

}