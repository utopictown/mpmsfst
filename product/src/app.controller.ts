import { BadRequestException, Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { EntityNotFoundError } from 'typeorm';
import { AppService } from './app.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_product')
  async create(data: CreateProductDto): Promise<Product> {
    try {
      return await this.appService.create(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @MessagePattern('find_all_product')
  async findAll(): Promise<Product[]> {
    try {
      return await this.appService.findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @MessagePattern('find_one_product')
  async findOne(id: number): Promise<Product> {
    try {
      return await this.appService.findOne(+id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @MessagePattern('update_product')
  async update(updateDto: UpdateProductDto): Promise<boolean> {
    try {
      return await this.appService.update(updateDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @MessagePattern('remove_product')
  async remove(deleteProductData: DeleteProductDto): Promise<boolean> {
    try {
      return await this.appService.remove(deleteProductData);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @EventPattern('decrease_stock')
  async decreaseStock(data: AdjustStockDto): Promise<boolean> {
    try {
      return await this.appService.decreaseStock(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @EventPattern('restore_stock')
  async restoreStock(data: AdjustStockDto): Promise<boolean> {
    try {
      return await this.appService.restoreStock(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
