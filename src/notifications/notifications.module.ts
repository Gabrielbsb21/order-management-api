import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationProcessor } from './notification.processor';
import { NotificationQueue } from './notification.queue';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: Number(configService.getOrThrow<string>('REDIS_PORT')),
        },
      }),
    }),

    BullModule.registerQueue({
      name: 'notificacao',
    }),
  ],
  providers: [NotificationProcessor, NotificationQueue],
  exports: [NotificationQueue],
})
export class NotificationsModule {}
