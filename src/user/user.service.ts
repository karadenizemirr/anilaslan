import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppDataSource } from "src/customService/database";
import { User } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "src/customService/jwt.service";
import { LazyModuleLoader } from "@nestjs/core";

@Injectable()
export class UserService {

    private userRepository:any

    constructor(private readonly jwtService: JwtService, private lazyModuleLoader: LazyModuleLoader) {
        this.userRepository = AppDataSource.getRepository(User)
    }

    // Create User
    async createUser(data:any){
        try{

            const user = new User()
            user.name = data.name
            user.surname = data.surname
            user.phone_number = data.phone_number
            user.email = data.email
            user.password = data.password
            user.identity_no = data.identity_no
            user.password = await bcrypt.hash(data.password, 5)
            const response = this.userRepository.save(user)

            return {
                message: "success"
            }
        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }

    //Update
    async updateUser(id:string, data:any){
        try{


            const user = await this.userRepository.findOneBy({id:id})

            if (user){
                user.name = data.name || user.name
                user.surname = data.surname || user.surname
                user.phone_number = data.phone_number || user.phone_number
                user.email = data.email || user.email
                user.password = data.password || user.password
                user.identity_no = data.identity_no || user.identity_no

                const response = this.userRepository.save(user)
                return {
                    "message": "success",
                    "data": response
                }
            }else{
                throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
            }

        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }
    // Delete
    async deleteUser(id:string){
        try{

            const user = await this.userRepository.findOneBy({id:id})

            if (user){
                const response = this.userRepository.remove(user)
                return {
                    "message": "success",
                    "data": response
                }
            }else{
                throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
            }

        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }

    // Get By Id
    async getUserById(id:string){
        try{


            const user = await this.userRepository.findOneBy({id:id})

            if (user){
                return {
                    "message": "success",
                    "data": user
                }
            }

        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }

    // Login Operating
    async login(email:string, password:string){
        try{
            
            const user = await this.userRepository.findOneBy({
                email: email
            })
            
            if (user){
                const isMatch = await bcrypt.compare(password, user.password)
                if (isMatch){

                    const token:string = this.jwtService.generaToken({id: user.id, email: user.email, role: user.role})
                    
                    return {
                        message: "success",
                        token: token
                    }
                }
            }

            return {message: false}
        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }

    async getAllUser(){
        try{

            return await this.userRepository.find()

        }catch(err){
            throw new HttpException('Interval Server Error', HttpStatus.BAD_REQUEST)
        }
    }
}
