import { Module } from '@nestjs/common';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), StripeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
