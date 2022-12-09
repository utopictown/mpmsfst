import { BadRequestException, Controller, Get, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EntityNotFoundError } from 'typeorm';
import { AppService } from './app.service';
import { CancelDto } from './dto/cancel.dto';
import { CheckoutCartDto } from './dto/checkout-cart.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cart } from './entities/cart.entity';
import { Order } from './entities/order.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('add_to_cart')
  async addToCart(data: CreateOrderDto): Promise<boolean> {
    try {
      return await this.appService.addToCart(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @MessagePattern('checkout_cart')
  async checkoutCart(data: CheckoutCartDto): Promise<boolean> {
    try {
      return await this.appService.checkoutCart(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @MessagePattern('direct_checkout')
  async create(data: CreateOrderDto): Promise<boolean> {
    try {
      return await this.appService.directCheckout(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @MessagePattern('find_all_order')
  async findAll(): Promise<Order[]> {
    try {
      return await this.appService.findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @MessagePattern('find_cart')
  async findCart(): Promise<Cart[]> {
    try {
      return await this.appService.findCart();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @MessagePattern('find_one_order')
  async findOne(id: number): Promise<Order> {
    try {
      return await this.appService.findOne(+id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @MessagePattern('cancel_order')
  async remove(cancelData: CancelDto): Promise<boolean> {
    try {
      return await this.appService.cancel(cancelData);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
