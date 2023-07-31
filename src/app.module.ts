import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { WorkModule } from './work/work.module';
import { JwtMdoule } from './customService/jwt.module';
import { JwtService } from './customService/jwt.service';

@Module({
  imports: [UserModule,WorkModule],
  controllers: [AppController],
  providers: [JwtService],
})
export class AppModule {}
