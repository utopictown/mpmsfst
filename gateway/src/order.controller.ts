import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { CheckoutCartDto } from './dto/orders/checkout-cart.dto';
import { CreateOrderDto } from './dto/orders/create-order.dto';
import { OrderDto } from './dto/orders/order.dto';
import { AppRequest } from './types';

@Controller('order')
@ApiBearerAuth()
export class OrderController {
  constructor(@Inject('ORDER') private orderClient: ClientProxy) {}

  @Post('/add-to-cart')
  async addToCart(@Body() createItemDto: CreateOrderDto, @Req() req: AppRequest, @Res() res: Response) {
    try {
      const result = await lastValueFrom(
        this.orderClient.send<OrderDto>('add_to_cart', {
          ...createItemDto,
          userId: req.userId,
        }),
      );

      return res.status(201).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Post('/checkout-cart')
  async checkoutCart(@Body() body: CheckoutCartDto, @Req() req: AppRequest, @Res() res: Response) {
    try {
      const result = await lastValueFrom(
        this.orderClient.send<OrderDto[]>('checkout_cart', {
          items: body.items,
          userId: req.userId,
        }),
      );

      return res.status(201).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Post()
  async directCheckout(@Body() createItemDto: CreateOrderDto, @Req() req: AppRequest, @Res() res: Response) {
    try {
      const result = await lastValueFrom(
        this.orderClient.send<OrderDto>('direct_checkout', {
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
      const result = await lastValueFrom(this.orderClient.send<OrderDto[]>('find_all_order', []));

      return res.status(200).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get('/cart')
  async findCart(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await lastValueFrom(this.orderClient.send<OrderDto[]>('find_cart', []));

      return res.status(200).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get('/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await lastValueFrom(this.orderClient.send('find_one_order', +id));

      return res.status(200).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Post('/cancel/:id')
  async cancel(@Param('id') id: string, @Req() req: AppRequest, @Res() res: Response) {
    try {
      const result = await lastValueFrom(this.orderClient.send('cancel_order', { id, userId: req.userId }));

      return res.status(200).json({ data: result });
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
