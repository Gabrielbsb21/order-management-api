import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: [
      {
        product: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPriceUSD: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: {
    product: string;
    quantity: number;
    unitPriceUSD: number;
  }[];

  @Prop({ required: true })
  totalValueUSD: number;

  @Prop({ required: true })
  totalValueBRL: number;

  @Prop({ type: String, default: null })
  receiptUrl: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
