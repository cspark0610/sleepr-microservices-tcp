import { Module } from '@nestjs/common';
import { LoggerModule, ConfigModule } from '@app/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [LoggerModule, ConfigModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
