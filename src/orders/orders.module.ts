import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { customerLoginChecker } from 'src/shared/middlewares/customerLoginChecker.middleware copy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
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
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(customerLoginChecker).forRoutes({
      path: 'orders',
      method: RequestMethod.POST
    })
  }
}
