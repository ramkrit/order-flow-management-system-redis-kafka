import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Orders } from '../models/order.model';
import { Users } from '../models/user.model';
import { KafkaProducerService } from '../kafka/kafka.producer';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders) private orderModel: typeof Orders,
    @InjectModel(Users) private userModel: typeof Users,
    private kafka: KafkaProducerService,
  ) { }

  async create(userId: number, amount: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new Error('User not found');
    const lastOrder = await this.orderModel.findOne({
      order: [['id', 'DESC']],
    });
    let orderNumber: number;
    if (!lastOrder) {
      orderNumber = 1;
    } else {
      const lastOrderId = lastOrder.orderId;
      const lastNum = parseInt(lastOrderId.replace('OID', ''), 10);
      orderNumber = lastNum + 1;
    }
    const orderId = `OID${orderNumber.toString().padStart(4, '0')}`;


    const created = await this.orderModel.create({ orderId, userId: user.id, amount });
    await this.kafka.send(process.env.KAFKA_ORDER_TOPIC || 'orders.created', {
      orderId: created.id,
      userId: user.id,
      amount: Number(created.amount),
      timestamp: new Date().toISOString(),
    });
    return created;
  }

  async listByUser(userId: number) {
    return this.orderModel.findAll({ where: { userId }, order: [['id', 'DESC']] });
  }

  async detailById(userId: number, orderId: string) {
    return this.orderModel.findAll({ where: { userId, orderId } });
  }
}
