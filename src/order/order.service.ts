import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: SoftDeleteModel<OrderDocument>,
  ) { }

  /** 🟢 1. Tạo đơn hàng mới */
  async create(createOrderDto: CreateOrderDto, user: IUser) {
    const newOrder = await this.orderModel.create({
      ...createOrderDto,
      status: 'Chờ xác nhận',
      createdBy: {
        _id: new mongoose.Types.ObjectId(user._id), // ✅ chuyển về ObjectId
        email: user.email,
      },
    });

    return {
      id: newOrder._id,
      createdAt: newOrder.createdAt,
      status: newOrder.status,
    };
  }

  /** 🟡 2. Lấy danh sách đơn hàng (có phân trang + lọc) */
  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const totalItems = await this.orderModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.orderModel
      .find(filter, projection)
      .skip(offset)
      .limit(limit)
      .sort((sort as any) || { createdAt: -1 })
      .populate('detail._id')
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  /** 🟢 3. Lấy chi tiết đơn hàng */
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid order id: ${id}`);
    }

    const order = await this.orderModel.findById(id).populate('detail._id');
    if (!order) throw new BadRequestException('Không tìm thấy đơn hàng.');
    return order;
  }

  /** 🟠 4. Cập nhật thông tin đơn hàng */
  async update(id: string, updateOrderDto: UpdateOrderDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid order id: ${id}`);
    }

    const updated = await this.orderModel.findByIdAndUpdate(
      id,
      {
        ...updateOrderDto,
        updatedBy: {
          _id: new mongoose.Types.ObjectId(user._id), // ✅ fix type
          email: user.email,
        },
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!updated) {
      throw new BadRequestException('Không tìm thấy đơn hàng để cập nhật!');
    }

    return updated;
  }

  /** 🔵 5. Cập nhật trạng thái đơn hàng */
  async updateStatus(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid order id: ${id}`);
    }

    const order = await this.orderModel.findById(id);
    if (!order) throw new BadRequestException('Không tìm thấy đơn hàng.');

    const validStatus = [
      'Chờ xác nhận',
      'Đang giao hàng',
      'Đã giao hàng',
      'Đã nhận hàng',
      'Hoàn hàng',
      'Đã nhận hàng hoàn',
      'Đã hủy đơn',
    ];

    if (!validStatus.includes(status)) {
      throw new BadRequestException(`Trạng thái không hợp lệ: ${status}`);
    }

    order.status = status;
    order.updatedBy = {
      _id: new mongoose.Types.ObjectId(user._id),
      email: user.email,
    };
    order.updatedAt = new Date();

    await order.save();

    return {
      _id: order._id,
      status: order.status,
      updatedAt: order.updatedAt,
    };
  }

  /** 🟣 6. Thống kê đơn hàng theo trạng thái (cho Dashboard) */
  async countByStatus() {
    const stats = await this.orderModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    return stats;
  }
}
