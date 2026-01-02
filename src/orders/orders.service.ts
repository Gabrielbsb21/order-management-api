import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ExchangeService } from '../exchange/exchange.service';
import { CustomersService } from '../customers/customers.service';
import { NotificationQueue } from '../notifications/notification.queue';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly exchangeService: ExchangeService,
    private readonly notificationQueue: NotificationQueue,
    private readonly customersService: CustomersService,
    private readonly uploadService: UploadService,
  ) {}

  private calculateTotalUSD(items: CreateOrderDto['items']): number {
    return items.reduce(
      (total, item) => total + item.quantity * item.unitPriceUSD,
      0,
    );
  }

  async create(dto: CreateOrderDto) {
    const customer = await this.customersService.findById(dto.customerId);

    const totalValueUSD = this.calculateTotalUSD(dto.items);
    const rate = await this.exchangeService.getUsdToBrlRate();
    const totalValueBRL = Number((totalValueUSD * rate).toFixed(2));

    const order = await this.orderModel.create({
      customerId: customer._id,
      date: new Date(dto.date),
      items: dto.items,
      totalValueUSD,
      totalValueBRL,
      receiptUrl: null,
    });

    await this.notificationQueue.notifyOrderCreated({
      orderId: order.id,
      customerName: customer.name,
      customerEmail: customer.email,
    });

    return order;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.orderModel.find().skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(),
    ]);

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async findById(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.orderModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
  }

  async uploadReceipt(orderId: string, file: Express.Multer.File) {
    const order = await this.findById(orderId);

    const receiptUrl = await this.uploadService.upload(file);

    order.receiptUrl = receiptUrl;
    await order.save();

    return order;
  }
}
