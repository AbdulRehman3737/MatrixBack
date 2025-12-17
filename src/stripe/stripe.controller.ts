import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async createCheckout(@Body() dto: CreateCheckoutDto) {
    const session = await this.stripeService.createCheckoutSession(
      dto.amount,
      dto.email,
    );
    return { url: session.url }; // frontend redirects to this URL
  }
}
