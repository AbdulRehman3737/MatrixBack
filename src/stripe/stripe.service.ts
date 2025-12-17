import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-11-17.clover',
    });
  }

  async createCheckoutSession(amount: number, email?: string) {
    // Validate amount
    if (!Number.isFinite(amount) || amount < 20 || amount > 5000) {
      throw new BadRequestException('Invalid amount');
    }

    return this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Custom Service Payment' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: email,
      metadata: {
        clientEmail: email || '',
      },
    });
  }

  constructEvent(payload: Buffer, sig: string, endpointSecret: string) {
    return this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  }
}
