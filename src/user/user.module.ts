import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtService } from "src/customService/jwt.service";
import { SessionService } from "src/customService/session.service";

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, JwtService, SessionService],
})

export class UserModule {}