import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.getResponse() as string;
    }

    if (statusCode){
      response.redirect('/')
    }

    // response
    //   .status(statusCode)
    //   .send({
    //     statusCode,
    //     message,
    //     timestamp: new Date().toISOString(),
    //   });
  }
}