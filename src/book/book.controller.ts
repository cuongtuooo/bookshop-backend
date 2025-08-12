import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post()
  @ResponseMessage('Create new Book')
  create(@Body() createBookDto: CreateBookDto, @User() user: IUser) {
    return this.bookService.create(createBookDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch list of Book')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: any
  ) {
    return this.bookService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Get book detail')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update book')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @User() user: IUser
  ) {
    return this.bookService.update(id, updateBookDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete book')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.bookService.remove(id, user);
  }
}
