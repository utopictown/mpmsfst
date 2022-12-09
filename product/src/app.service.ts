import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async create(data: CreateProductDto): Promise<Product> {
    return await this.productRepository.save(this.productRepository.create(data));
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOneByOrFail({ id });
  }

  async update(updateData: UpdateProductDto): Promise<boolean> {
    await this.productRepository.update({ id: updateData.id, userId: updateData.userId }, updateData.data);
    return true;
  }

  async remove(deleteProduct: DeleteProductDto): Promise<boolean> {
    await this.productRepository.delete({
      id: deleteProduct.id,
      userId: deleteProduct.userId,
    });
    return true;
  }

  async decreaseStock(data: AdjustStockDto): Promise<boolean> {
    const product = await this.findOne(data.productId);
    await this.productRepository.update({ id: data.productId }, { stock: product.stock - data.count });
    return true;
  }

  async restoreStock(data: AdjustStockDto): Promise<boolean> {
    const product = await this.findOne(data.productId);
    await this.productRepository.update({ id: data.productId }, { stock: product.stock + data.count });
    return true;
  }
}
