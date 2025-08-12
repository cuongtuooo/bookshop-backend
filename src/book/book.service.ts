import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { Category } from 'src/category/schemas/category.schema';
import { Book, BookDocument } from './schemas/book.schemas';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: SoftDeleteModel<BookDocument>,

    @InjectModel(Category.name)
    private categoryModel: mongoose.Model<Category>
  ) { }

  async create(createBookDto: CreateBookDto, user: IUser) {
    const {
      name,
      thumbnail,
      slider,
      mainText,
      desc,
      author,
      price,
      sold,
      quantity,
      category,
    } = createBookDto;

    const categoryExist = await this.categoryModel.findById(category);
    if (!categoryExist) {
      throw new BadRequestException('Category không tồn tại');
    }

    const newBook = await this.bookModel.create({
      name,
      thumbnail,
      slider,
      mainText,
      desc,
      author,
      price: +price,
      sold: +sold,
      quantity: +quantity,
      category: {
        _id: categoryExist._id,
        name: categoryExist.name,
      },
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      createdAt: newBook?.createdAt,
      id: newBook?._id,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit || 10;

    const totalItems = await this.bookModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.bookModel
      .find(filter, projection)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid book id: ${id}`);
    }

    return await this.bookModel.findOne({ _id: id });
  }

  async update(id: string, updateBookDto: UpdateBookDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid book id: ${id}`);
    }

    return await this.bookModel.updateOne(
      { _id: id },
      {
        ...updateBookDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid book id: ${id}`);
    }

    await this.bookModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return await this.bookModel.softDelete({ _id: id });
  }
}
