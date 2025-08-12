import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { InvoicesModule } from './invoices/invoices.module';
import { StockModule } from './stock/stock.module';
import { CommonModule } from './common/common.module';
import { SetupModule } from './setup/setup.module';
import { MailModule } from './mail/mail.module';
import { WooCommerceModule } from './woocommerce/woocommerce.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
     useFactory: (configService: ConfigService) => ({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: Number(configService.get<string>('POSTGRES_PORT')) || 5432,
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
}),
      inject: [ConfigService],
    }),
    UsersModule,
    SetupModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    InvoicesModule,
    StockModule,
    CommonModule,
    MailModule,
    WooCommerceModule,
    WebhookModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
