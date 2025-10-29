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
    type: string; // COD, BANKING, v.v.

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
        ],
    })
    detail: {
        _id: mongoose.Types.ObjectId;
        quantity: number;
        bookName: string;
    }[];

    @Prop()
    totalPrice: number;

    /** 🆕 Trạng thái đơn hàng */
    @Prop({
        type: String,
        enum: [
            'Chờ xác nhận',      // user vừa đặt
            'Đang giao hàng',    // admin nhấn “Giao hàng”
            'Đã giao hàng',      // admin xác nhận giao xong
            'Đã nhận hàng',      // user xác nhận đã nhận
            'Hoàn hàng',         // user báo hoàn
            'Đã nhận hàng hoàn', // admin xác nhận hoàn thành hoàn
            'Đã hủy đơn',        // user hủy
        ],
        default: 'Chờ xác nhận',
    })
    status: string;

    /** Người tạo đơn */
    @Prop({
        type: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            email: String,
        },
    })
    createdBy: {
        _id: mongoose.Types.ObjectId;
        email: string;
    };

    /** Người cập nhật đơn */
    @Prop({
        type: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            email: String,
        },
    })
    updatedBy: {
        _id: mongoose.Types.ObjectId;
        email: string;
    };

    /** Người xóa đơn */
    @Prop({
        type: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            email: String,
        },
    })
    deletedBy: {
        _id: mongoose.Types.ObjectId;
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
