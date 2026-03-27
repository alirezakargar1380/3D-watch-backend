import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from './entities/customer.entity';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { customerLoginChecker } from 'src/shared/middlewares/customerLoginChecker.middleware copy';
import { CustomersController } from './contollers/customers.controller';
import { CustomerOrdersController } from './contollers/customer-ordres.contoller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customers
    ]),
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
  controllers: [CustomersController, CustomerOrdersController],
  providers: [CustomersService],
})
export class CustomersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(customerLoginChecker).forRoutes({
      path: 'customers/auth/me',
      method: RequestMethod.GET
    })
    consumer.apply(userLoginChecker).forRoutes({
      path: 'customers/:id',
      method: RequestMethod.DELETE
    })
  }
}
