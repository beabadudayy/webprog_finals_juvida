import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(); // Critical for React to talk to Nest
  await app.listen(3000);
}

if (require.main === module) {
  bootstrap();
}
// Export for Vercel Serverless
export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
