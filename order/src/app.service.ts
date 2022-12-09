import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CancelDto } from './dto/cancel.dto';
import { CheckoutCartDto } from './dto/checkout-cart.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cart } from './entities/cart.entity';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @Inject('PRODUCT')
    private productClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async addToCart(data: CreateOrderDto): Promise<boolean> {
    const existingItem = await this.cartRepository.findOneBy({
      productId: data.productId,
    });

    if (existingItem) {
      await this.cartRepository.update({ productId: data.productId }, data);
    }
    await this.cartRepository.save(this.cartRepository.create(data));
    return true;
  }

  async checkoutCart(data: CheckoutCartDto): Promise<boolean> {
    for (const cartId of data.items) {
      const cart = await this.cartRepository.findOneBy({
        id: cartId,
        userId: data.userId,
      });

      if (!cart) throw new Error('cart item not found');

      const order: CreateOrderDto = new Order();
      order.count = cart.count;
      order.productId = cart.productId;
      order.userId = cart.userId;
      await this.checkout(order);
      this.cartRepository.remove(cart);
    }
    return true;
  }

  async directCheckout(data: CreateOrderDto): Promise<boolean> {
    await this.checkout(data);
    return true;
  }

  async checkout(data: CreateOrderDto): Promise<boolean> {
    await this.orderRepository.save(this.orderRepository.create(data));
    this.productClient.emit('decrease_stock', {
      count: data.count,
      productId: data.productId,
    });
    return true;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findCart(): Promise<Cart[]> {
    return await this.cartRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderRepository.findOneByOrFail({ id });
  }

  async cancel(cancelData: CancelDto): Promise<boolean> {
    await this.orderRepository.update(
      { id: cancelData.id, userId: cancelData.userId },
      { status: OrderStatus.CANCELLED },
    );
    const order = await this.findOne(cancelData.id);
    this.productClient.emit('restore_stock', {
      count: order.count,
      productId: order.productId,
    });
    return true;
  }
}
