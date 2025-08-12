import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/book/schemas/book.schemas';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    phone: string;

    @Prop()
    type: string;

    @Prop()
    paymentStatus: string;

    @Prop()
    paymentRef: string;

    @Prop({
    type: [
        {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: Book.name, required: true },
        quantity: { type: Number, required: true },
        bookName: { type: String, required: true },
        },
    ],})
    detail: {
    _id: mongoose.Types.ObjectId;
    quantity: number;
    bookName: string;
    }[];

    @Prop()
    totalPrice: number;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: Date;

    @Prop()
    deletedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
