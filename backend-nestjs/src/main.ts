import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'api-docs', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('ESL WEB API')
    .setDescription('The ESL API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // This is a name/key to reference in @ApiBearerAuth()
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  app.use(helmet()); // security middleware
  app.useGlobalPipes(new ValidationPipe()); // Input validation for dtp file


  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',  // frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port, () => {
    console.log(`live on port: ${port}`)
  });
}
bootstrap();
