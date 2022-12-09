import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsUUID()
  @Column()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @Column()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Column()
  count: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
