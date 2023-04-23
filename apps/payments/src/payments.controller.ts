import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCharge(@Payload() { card, amount }: CreateChargeDto) {
    console.log('CARD', card);
    console.log('amount', amount);
    return this.paymentsService.createCharge(card, amount);
  }
}
