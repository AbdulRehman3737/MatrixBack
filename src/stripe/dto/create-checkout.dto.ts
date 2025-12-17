import { IsNumber, IsOptional, IsEmail, Min, Max } from 'class-validator';

export class CreateCheckoutDto {
  @IsNumber()
  @Min(50)
  @Max(5000)
  amount: number;

  @IsOptional()
  @IsEmail()
  email?: string;
}
