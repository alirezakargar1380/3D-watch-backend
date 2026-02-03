import { IsInt, IsString, Min } from 'class-validator';

export class CreateStripeDto {
    @IsInt()
    @Min(1)
    amount: number; // amount in smallest currency unit (e.g., cents)

    @IsString()
    currency: string;
}
