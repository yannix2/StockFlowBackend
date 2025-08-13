import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS BEFORE starting the server
  app.enableCors({
    origin: 'https://stock-flow-frontend-v7hf.vercel.app', // your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Use body parser (if needed)
  app.use(
    bodyParser.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString();
      },
    }),
  );

  await app.listen(process.env.PORT ?? 5000); // ✅ Start server after setup
}
bootstrap();
