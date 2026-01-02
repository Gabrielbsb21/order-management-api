import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationQueue {
  constructor(
    @InjectQueue('notificacao')
    private readonly notificationQueue: Queue,
  ) {}

  async notifyOrderCreated(payload: {
    orderId: string;
    customerName: string;
    customerEmail: string;
  }) {
    await this.notificationQueue.add('order-created', payload);
  }
}
