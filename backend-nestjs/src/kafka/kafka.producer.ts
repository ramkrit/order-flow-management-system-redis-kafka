import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Admin } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;
  private admin: Admin;
  private kafka: Kafka;

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'nestjs-app',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });

    this.admin = this.kafka.admin();
    await this.admin.connect();

    // Ensure topic exists
    const topicName = process.env.KAFKA_ORDER_TOPIC || 'orders.created';
    const topics = await this.admin.listTopics();
    if (!topics.includes(topicName)) {
      await this.admin.createTopics({
        topics: [
          {
            topic: topicName,
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
      console.log(`Kafka topic "${topicName}" created`);
    } else {
      console.log(`Kafka topic "${topicName}" already exists`);
    }

    await this.admin.disconnect();

    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer?.disconnect();
  }

  async send(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
