import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notificacao')
export class NotificationProcessor extends WorkerHost {
  process(job: Job): Promise<void> {
    return Promise.resolve().then(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { orderId, customerName, customerEmail } = job.data;

        console.log(
          `[EMAIL] Pedido ${orderId} confirmado para ${customerName} (${customerEmail})`,
        );
      } catch (error) {
        console.error('[EMAIL] Failed to process notification', error);
        throw error;
      }
    });
  }
}
