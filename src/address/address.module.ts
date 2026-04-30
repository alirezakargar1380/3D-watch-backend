import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { customerLoginChecker } from 'src/shared/middlewares/customerLoginChecker.middleware copy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Address
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
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(customerLoginChecker).forRoutes({
      path: 'address',
      method: RequestMethod.POST
    })
    consumer.apply(customerLoginChecker).forRoutes({
      path: 'address',
      method: RequestMethod.GET
    })
    consumer.apply(customerLoginChecker).forRoutes({
      path: 'address/:id/primary',
      method: RequestMethod.PATCH
    })
  }
}
