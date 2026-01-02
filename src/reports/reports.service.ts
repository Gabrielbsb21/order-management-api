import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../orders/schemas';
import { Model } from 'mongoose';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async getTopCustomers(limit = 5) {
    return this.orderModel.aggregate([
      {
        $group: {
          _id: '$customerId',
          totalSpent: { $sum: '$totalValueBRL' },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
    ]);
  }
}
