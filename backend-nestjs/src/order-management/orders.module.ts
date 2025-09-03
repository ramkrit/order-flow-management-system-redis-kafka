import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Orders } from '../models/order.model';
import { Users } from '../models/user.model';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { AuthGuard } from '../auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Orders, Users]),
    AuthModule,
    KafkaModule
  ],
  providers: [OrdersService, AuthGuard],
  controllers: [OrdersController],
})
export class OrdersModule { }
