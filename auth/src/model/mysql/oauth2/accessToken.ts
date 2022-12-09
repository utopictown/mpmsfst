import * as crypto from 'crypto';
import * as moment from 'moment';
import { AppDataSource } from '../../../data-source';
import { AccessToken } from '../../../entity/AccessToken';

import { MoreThan } from 'typeorm';

const accessTokenRepo = AppDataSource.getRepository(AccessToken);

export function getToken(accessToken: any) {
  return accessToken.token;
}

export async function create(userId: any, clientId: any, scope: any, ttl: any, cb: (err: any, data?: any) => void) {
  const token = crypto.randomBytes(64).toString('hex');
  const obj = {
    token: token,
    userId: userId,
    clientId: clientId,
    scope: scope,
    ttl: new Date().getTime() + ttl * 1000,
  };
  await accessTokenRepo.save(accessTokenRepo.create(obj));
  cb(null, token);
}

export async function fetchByToken(token: string, cb: (err: any, data?: any) => void) {
  const data = await accessTokenRepo.findOne({ where: { token } });
  cb(null, data);
}

export function checkTTL(accessToken: any) {
  return +accessToken.ttl > new Date().getTime();
}

export async function revokeToken(req, res, next) {
  await accessTokenRepo.delete({ id: req.oauth2.accessToken.id });
  next();
}

export function getTTL(accessToken: any, cb: (err: any, data?: any) => void) {
  const ttl = moment(accessToken.ttl).diff(new Date(), 'seconds');
  return cb(null, ttl > 0 ? ttl : 0);
}

export async function fetchByUserIdClientId(userId: any, clientId: any, cb: (err: any, data?: any) => void) {
  const accessToken = await accessTokenRepo.find({
    where: [{ userId }, { clientId }, { ttl: MoreThan(new Date().getTime()) }],
    order: { ttl: 'DESC' },
  })[0];
  cb(null, accessToken);
}
