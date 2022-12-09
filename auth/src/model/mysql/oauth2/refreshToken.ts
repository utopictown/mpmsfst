import * as crypto from 'crypto';
import { AppDataSource } from '../../../data-source';
import { RefreshToken } from '../../../entity/RefreshToken';

const TABLE = 'refresh_token';

const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);

export function getUserId(refreshToken: { userId: string }): string {
  return refreshToken.userId;
}

export function getClientId(refreshToken: { clientId: string }): string {
  return refreshToken.clientId;
}

export function getScope(refreshToken: { scope: string }): string {
  return refreshToken.scope;
}

export async function fetchByToken(token: string, cb: (err: Error | null, result: any) => void): Promise<void> {
  const data = refreshTokenRepo.findOne({ where: { token } });
  cb(null, data);
}

export async function removeByUserIdClientId(
  userId: string,
  clientId: string,
  cb: (err: Error | null) => void,
): Promise<void> {
  await refreshTokenRepo.delete({ userId, clientId });
  cb(null);
}

export async function create(
  userId: string,
  clientId: string,
  scope: string,
  cb: (err: Error | null, token: string) => void,
): Promise<void> {
  const token = crypto.randomBytes(64).toString('hex');
  const obj = { token, userId, clientId, scope };

  await refreshTokenRepo.save(refreshTokenRepo.create(obj));
  cb(null, token);
}
