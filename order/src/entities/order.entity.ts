import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
  WAITING_FOR_PAYMENT = 'waiting_for_payment',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Column()
  productId: number;

  @IsNotEmpty()
  @IsUUID()
  @Column()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @Column()
  count: number;

  @IsNumber()
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.WAITING_FOR_PAYMENT,
  })
  status: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
