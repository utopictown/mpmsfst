import { AppDataSource } from '../../../data-source';
import { User } from '../../../entity/User';

const userRepo = AppDataSource.getRepository(User);

export function getId(user: any) {
  return user['id'];
}

export async function fetchById(id: any, cb: (err: any, data?: any) => void) {
  const data = await userRepo.findOne({ where: { id } });
  cb(null, data);
}

export async function fetchByUsername(username: string, cb: (err: any, data?: any) => void) {
  const data = await userRepo.findOne({ where: { username } });
  cb(null, data);
}

export function checkPassword(user: any, password: string, cb: (err: any, data?: any) => void) {
  user.password == password ? cb(null, true) : cb(null, false);
}

export function fetchFromRequest(req: any) {
  return req.session.user;
}
