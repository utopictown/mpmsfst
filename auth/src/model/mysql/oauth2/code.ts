import * as crypto from 'crypto';
import { AppDataSource } from '../../../data-source';
import { AuthorizationCode } from '../../../entity/AuthorizationCode';

const TABLE = 'authorization_code';

const authCodeRepo = AppDataSource.getRepository(AuthorizationCode);

export async function create(userId: any, clientId: any, scope: any, ttl: any, cb: (err: any, data?: any) => void) {
  const code = crypto.randomBytes(32).toString('hex');
  const obj = {
    code: code,
    userId: userId,
    clientId: clientId,
    scope: Array.isArray(scope) ? scope.join(',') : String(scope),
    ttl: new Date().getTime() + ttl * 1000,
  };

  await authCodeRepo.save(authCodeRepo.create(obj));
  cb(null, code);
}

export async function fetchByCode(code: string, cb: (err: any, data?: any) => void) {
  const data = await authCodeRepo.findOne({ where: { code } });
  cb(null, data);
}

export function getUserId(code: any) {
  return code.userId;
}

export function getClientId(code: any) {
  return code.clientId;
}

export function getScope(code: any) {
  return code.scope;
}

export function checkTtl(code: any) {
  return +code.ttl > new Date().getTime();
}

export async function removeByCode(code: string, cb: (err: any, data?: any) => void) {
  await authCodeRepo.delete({ code });
  cb(null, true);
}
