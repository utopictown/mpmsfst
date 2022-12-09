import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AuthorizationCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  userId: string;

  @Column()
  clientId: string;

  @Column()
  scope: string;

  @Column('bigint')
  ttl: number;
}
