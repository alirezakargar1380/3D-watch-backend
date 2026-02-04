import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, RawBody, Req, RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { Request, Response } from 'express';
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

  @Post('/checkout')
  async createSession(@Res() res: Response) {
    try {
      const session = await this.stripe.checkout.sessions.create({

        payment_method_types: ['card'],
        mode: 'payment',

        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Test Order',
              },
              unit_amount: 1000, // amount, 
            },
            quantity: 1,
          }
        ],

        // is only for display
        success_url: 'http://localhost:3000/api/stripe/payment-success?session_id={CHECKOUT_SESSION_ID}',
        // is only for display
        cancel_url: 'http://localhost:3000/api/stripe/payment-cancel',

      })

      res.status(HttpStatus.ACCEPTED).send({
        url: session.url
      })
    } catch (e) {

    }
  }

  /**
   *    TODO:
   *      - implement webhook API from stripe CLI
   */
  @Post('webhook')
  handleWebhook(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    let token: string = this.config.get<string>('STRIPE_TOKEN') || '';
    const sig = req.headers['stripe-signature'];

    if (!req.rawBody || !sig) return res.status(HttpStatus.BAD_REQUEST).send('not acceptable')

    const event = this.stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      token,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // ✅ mark order as paid in DB
    }

    
  }
}
