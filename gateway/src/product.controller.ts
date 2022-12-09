import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/products/create-product.dto';
import { ProductDto } from './dto/products/product.dto';
import { UpdateProductDto } from './dto/products/update-product.dto';
import { AppRequest } from './types';

@Controller('product')
@ApiBearerAuth()
export class ProductController {
  constructor(@Inject('PRODUCT') private productClient: ClientProxy) {}

  @Post()
  async create(@Body() createItemDto: CreateProductDto, @Req() req: AppRequest, @Res() res: Response) {
    try {
      const result = await lastValueFrom(
        this.productClient.send<ProductDto>('create_product', {
          ...createItemDto,
          userId: req.userId,
        }),
      );

      return res.status(201).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await lastValueFrom(this.productClient.send<ProductDto[]>('find_all_product', []));

      return res.status(200).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get('/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await lastValueFrom(this.productClient.send('find_one_product', +id));

      return res.status(200).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateProductDto,
    @Req() req: AppRequest,
    @Res() res: Response,
  ) {
    try {
      const result = await lastValueFrom(
        this.productClient.send('update_product', {
          id,
          userId: req.userId,
          data: updateOrderDto,
        }),
      );

      return res.status(200).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Delete('/:id')
  async remove(@Param('id') id: string, @Req() req: AppRequest, @Res() res: Response) {
    try {
      const result = await lastValueFrom(this.productClient.send('remove_product', { id, userId: req.userId }));

      return res.status(200).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
