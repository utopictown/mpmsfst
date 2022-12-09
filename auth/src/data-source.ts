import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AccessToken } from './entity/AccessToken';
import { AuthorizationCode } from './entity/AuthorizationCode';
import { Client } from './entity/Client';
import { LogActivity } from './entity/LogActivity';
import { RefreshToken } from './entity/RefreshToken';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, AccessToken, AuthorizationCode, Client, RefreshToken, LogActivity],
  migrations: [],
  subscribers: [],
});
