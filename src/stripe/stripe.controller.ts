import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller('stripe')
export class StripeController {
  private stripe: Stripe;

  constructor(private readonly stripeService: StripeService, private config: ConfigService) {
    let token: string = this.config.get<string>('STRIPE_TOKEN') || '';
    this.stripe = new Stripe(token);
  }

  @Post('/create-transaction')
  async createTransaction(@Body() createStripeDto: CreateStripeDto, @Res() res: Response) {
    const { amount, currency }: { amount: number; currency: string } = createStripeDto;

    if (!amount || !currency) {
      return res.status(400).send({ error: 'Amount and currency are required.' });
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Store the payment details to your DB especially the id. You'll need it later to confirm or reject the payment
      // await Payment.create({
      //   payment_intent_id: paymentIntent.id,
      //   amount: amount,
      //   currency: currency,
      //   status: paymentIntent.status,
      // });

      res.status(200).send({
        clientSecret: paymentIntent//.client_secret,
      });

      // ex response:
      //       {
      //     "clientSecret": {
      //         "id": "pi_3Sw4v1KOokB2yPJM19d2ERGG",
      //         "object": "payment_intent",
      //         "amount": 1000,
      //         "amount_capturable": 0,
      //         "amount_details": {
      //             "tip": {}
      //         },
      //         "amount_received": 0,
      //         "application": null,
      //         "application_fee_amount": null,
      //         "automatic_payment_methods": {
      //             "allow_redirects": "always",
      //             "enabled": true
      //         },
      //         "canceled_at": null,
      //         "cancellation_reason": null,
      //         "capture_method": "automatic_async",
      //         "client_secret": "pi_3Sw4v1KOokB2yPJM19d2ERGG_secret_jsAVPE6yNOuBnzBjl1aEfnlsl",
      //         "confirmation_method": "automatic",
      //         "created": 1769968723,
      //         "currency": "usd",
      //         "customer": null,
      //         "customer_account": null,
      //         "description": null,
      //         "excluded_payment_method_types": null,
      //         "last_payment_error": null,
      //         "latest_charge": null,
      //         "livemode": false,
      //         "metadata": {},
      //         "next_action": null,
      //         "on_behalf_of": null,
      //         "payment_method": null,
      //         "payment_method_configuration_details": {
      //             "id": "pmc_1Omy3iKOokB2yPJMsy9ABIlK",
      //             "parent": null
      //         },
      //         "payment_method_options": {
      //             "card": {
      //                 "installments": null,
      //                 "mandate_options": null,
      //                 "network": null,
      //                 "request_three_d_secure": "automatic"
      //             },
      //             "cashapp": {},
      //             "link": {
      //                 "persistent_token": null
      //             }
      //         },
      //         "payment_method_types": [
      //             "card",
      //             "link",
      //             "cashapp"
      //         ],
      //         "processing": null,
      //         "receipt_email": null,
      //         "review": null,
      //         "setup_future_usage": null,
      //         "shipping": null,
      //         "source": null,
      //         "statement_descriptor": null,
      //         "statement_descriptor_suffix": null,
      //         "status": "requires_payment_method",
      //         "transfer_data": null,
      //         "transfer_group": null
      //     }
      // }


    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  @Get()
  findAll() {
    return this.stripeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStripeDto: UpdateStripeDto) {
    return this.stripeService.update(+id, updateStripeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripeService.remove(+id);
  }
}
