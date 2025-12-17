import { Controller, Post, Req, Headers, HttpCode } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import type { Request } from 'express';

@Controller('stripe')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  @HttpCode(200) // Stripe expects 2xx response
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = this.stripeService.constructEvent(
        req.body as Buffer,
        sig,
        endpointSecret,
      );
    } catch (err) {
      console.error('Webhook verification failed:', err.message);
      return { status: 400, message: 'Webhook verification failed' };
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(
        '✅ Payment confirmed:',
        session.id,
        'Amount:',
        session.amount_total,
      );
      console.log('Customer email:', session.customer_email);
    }

    return { received: true };
  }
}
