import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly stripe = new Stripe(
    this.configService.get<string>('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2022-11-15',
    },
  );

  async createCharge(
    card: Stripe.PaymentMethodCreateParams.Card1,
    amount: number,
  ) {
    //first create a paymentMethod
    const paymentMethod: Stripe.Response<Stripe.PaymentMethod> =
      await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          cvc: card.cvc,
          exp_month: card.exp_month,
          exp_year: card.exp_year,
          number: card.number,
        },
      });

    //then create paymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    return paymentIntent;
  }
}
