import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
    @Prop()
    name: string;

    @Prop()
    thumbnail: string;

    @Prop()
    slider: string[];

    @Prop()
    mainText: string;

    @Prop()
    desc: string;

    @Prop()
    author: string;

    @Prop()
    price: number;

    @Prop()
    sold: number;

    @Prop()
    quantity: number;

    @Prop({type: Object})
    category: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };

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

export const BookSchema = SchemaFactory.createForClass(Book);
