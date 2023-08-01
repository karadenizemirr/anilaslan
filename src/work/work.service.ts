import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppDataSource } from "src/customService/database";
import { Work } from "./dto/work.dto";
import { User } from "src/user/dto/user.dto";
import { Apporoved } from "./dto/apporoved.dto";

@Injectable()
export class WorkService {
    private workRepository:any
    private userRepository:any
    private apporovedRepository:any

    constructor() {
        this.workRepository = AppDataSource.getRepository(Work)
        this.userRepository = AppDataSource.getRepository(User)
        this.apporovedRepository = AppDataSource.getRepository(Apporoved)
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

            return await this.workRepository.find({order: {create_at: 'DESC'}})

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

    // GetworkbyId
    async getWorkById(id:any){
        try{

            const work = await this.workRepository.findOne({where: {id:id}, relations: ['users', 'apporoveds']})

            if(work){
                return {
                    message: "success",
                    data: work
                }
            }

        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }

    // Application
    async getApplication(userId:string, workId:string){
        try{

            const work = await this.workRepository.findOne({ where: { id: workId }, relations: ['users'] });
            const user = await this.userRepository.findOne({ where: { id: userId }});
            if (!user || !work) {
                throw new Error('User or Work not found');
              }
          
              if (!work.users) {
                work.users = [];
              }
              work.users.push(user);
          
              await this.workRepository.save(work);

              return {
                message: "success"
              }

        }catch(err){
            console.log(err)
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }

    // Apporeved Jops
    async apporevedJops(userId:string, workId:string){
        try {
            const work = await this.workRepository.findOneBy({id: workId})
            const user = await this.userRepository.findOneBy({id: userId})

            if (work) {
              const apporoved = new Apporoved();
              apporoved.status = false;
              apporoved.work = work;
              apporoved.user = user
              
              await this.apporovedRepository.save(apporoved);
            }
          } catch (err) {
            console.log(err);
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST);
          }
    }

    // Delete Work
    async deleteWork(id:string){
        try{

            const work = await this.workRepository.findOne({where: {id:id}})
            
            if (work){
                await this.workRepository.remove(work)

                return {
                    message: "success"
                }
            }

        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }

    async updateWork(workId:string, data:any){
        try{


            const work = await this.workRepository.findOne({where: {id:workId}})
            if (work){

                work.title = data.title || work.title
                work.description = data.description || work.description
                work.airport_number = data.airport_number || work.airport_number
                work.tour = data.tour || work.tour
                work.person = data.person || work.person
                work.note = data.note || work.note
                work.price = data.price || work.price
                work.from_where = data.from_where || work.from_where
                work.where = data.where || work.where

                await this.workRepository.save(work)

                return {
                    message: "success"
                }
            }else{
                throw new HttpException('Work not found', HttpStatus.BAD_REQUEST)
            }

        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }
}