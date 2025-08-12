import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schemas';
import { Category, CategorySchema } from 'src/category/schemas/category.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Book.name, schema: BookSchema },
    { name: Category.name, schema: CategorySchema}
  ])],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}
