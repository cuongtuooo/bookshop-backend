import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Book, BookSchema } from 'src/book/schemas/book.schemas';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';
import { Dashboard, DashboardSchema } from './schemas/dashboard.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
      { name: Book.name, schema: BookSchema },
      { name: Order.name, schema: OrderSchema }
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
