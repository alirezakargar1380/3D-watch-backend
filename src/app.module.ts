import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { TabsModule } from './tabs/tabs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { ColorsModule } from './colors/colors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('T_DB_HOST'),
        port: parseInt(config.get<string>('T_DB_PORT') || '3306', 10),
        username: config.get<string>('T_DB_USERNAME'),
        password: config.get<string>('T_DB_PASSWORD'),
        database: config.get<string>('T_DB_DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    StripeModule,
    ProductsModule,
    TabsModule,
    OrdersModule,
    ColorsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
