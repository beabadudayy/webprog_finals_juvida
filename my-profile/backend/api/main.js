const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module'); // Ensure this points to your compiled code

module.exports = async (req, res) => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
