import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class LogActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accessToken: string;

  @Column()
  method: string;

  @Column()
  requestPath: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
