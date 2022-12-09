import { AppDataSource } from '../../../data-source';
import { Client } from '../../../entity/Client';

const TABLE = 'client';

const clientRepo = AppDataSource.getRepository(Client);

export function getId(client: any) {
  return client.id;
}

export async function fetchById(clientId: any, cb: (err: any, data?: any) => void) {
  const data = await clientRepo.findOne({ where: { id: clientId } });
  cb(null, data);
}

export function checkSecret(client: any, secret: string, cb: (err: any, data?: any) => void) {
  return cb(null, client.secret == secret);
}

export function getRedirectUri(client: any) {
  return client.redirectUri;
}

export function checkRedirectUri(client: any, redirectUri: string) {
  return (
    redirectUri.indexOf(getRedirectUri(client)) === 0 &&
    redirectUri.replace(getRedirectUri(client), '').indexOf('#') === -1
  );
}
