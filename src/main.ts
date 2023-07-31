import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { join } from 'path';
import { AppDataSource } from './customService/database';
import secureSession from '@fastify/secure-session';
import fastifyCsrf from '@fastify/csrf-protection';
import * as handlebars from 'handlebars';
import { GlobalExceptionFilter } from './middleware/notfound.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  AppDataSource.initialize()
    .then(() => console.log('Database Connect Success'))
    .catch((err) => console.log(err))

    
  app.useStaticAssets({
    root: join(__dirname, '..', 'src/public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'src/views'),
    layout: 'layouts/main'
  });

  handlebars.registerHelper('eq', function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  await app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
    cookie: {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 3600000, // 1 saat
    }
  });

  await app.register(fastifyCsrf);
  //app.useGlobalFilters(new GlobalExceptionFilter())

  await app.listen(process.env.PORT ?? 3000, process.env.HOST || '0.0.0.0');
}
bootstrap();