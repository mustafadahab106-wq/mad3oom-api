import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.getHttpAdapter().get('/', (req, res) => {
    res.json({
      message: 'Mad3oom API is running!',
      status: 'ok',
      database: 'SQLite connected',
      time: new Date().toISOString()
    });
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
