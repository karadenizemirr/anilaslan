import { Module } from "@nestjs/common";
import { WorkController } from "./work.controller";
import { WorkService } from "./work.service";
import { JwtService } from "src/customService/jwt.service";

@Module({
    controllers: [WorkController],
    providers: [WorkService, JwtService]
})

export class WorkModule {}