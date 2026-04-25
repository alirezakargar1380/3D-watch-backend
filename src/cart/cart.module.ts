import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { customerLoginChecker } from 'src/shared/middlewares/customerLoginChecker.middleware copy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('CUSTOMER_JWT_AUTH_SECRET'),
        signOptions: {
          expiresIn: Number(config.get<string>('CUSTOMER_JWT_AUTH_SECRET')) || '24h',
        },
      }),
    }),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(customerLoginChecker).forRoutes({
      path: 'cart',
      method: RequestMethod.POST
    })
  }
}
