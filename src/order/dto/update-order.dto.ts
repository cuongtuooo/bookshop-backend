import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsOptional()
    @IsString()
    @IsIn([
        'Chờ xác nhận',
        'Đang giao hàng',
        'Đã giao hàng',
        'Đã nhận hàng',
        'Hoàn hàng',
        'Đã nhận hàng hoàn',
    ], { message: 'Trạng thái không hợp lệ!' })
    status?: string;
}
