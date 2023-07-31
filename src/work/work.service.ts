import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppDataSource } from "src/customService/database";
import { Work } from "./dto/work.dto";

@Injectable()
export class WorkService {
    private workRepository:any

    constructor() {
        this.workRepository = AppDataSource.getRepository(Work)
    }

    // Add Work
    async addWork(data:any){
        try{

            const work = new Work()
            work.title = data.title
            work.description = data.description
            work.from_where = data.from_where
            work.where = data.where
            work.airport_number = data.airport_number
            work.tour = data.tour
            work.person = data.person
            work.note = data.note
            work.price = data.price

            this.workRepository.save(work)

            return {
                message: "success"
            }


        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }

    // All Works
    async getWorks(){
        try{

            return await this.workRepository.find()

        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }

    // Search
    async searchWork(keyword:any){
        try{

            const works = await this.workRepository
            .createQueryBuilder('work')
            .where('work.title LIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('work.description LIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('work.where LIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('work.from_where LIKE :keyword', { keyword: `%${keyword}%` })
            .getMany();

            return works

        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }
}