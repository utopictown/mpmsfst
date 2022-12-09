import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  userId: string;

  @Column()
  clientId: string;

  @Column()
  scope: string;

  @Column('bigint')
  ttl: number;
}
