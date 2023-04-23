import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations/reservations.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  const configService = app.get(ConfigService);
  const reservationsPort = configService.get<number>('RESERVATIONS_PORT');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useLogger(app.get(Logger));

  await app.listen(reservationsPort, () => {
    console.log(
      `Reservations service is listening on port ${reservationsPort}`,
    );
  });
}
bootstrap();
