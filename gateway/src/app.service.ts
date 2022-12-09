import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppRequest } from './types';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async checkAuth(req: AppRequest) {
    const config = {
      headers: {},
    };

    const authToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    if (authToken)
      config.headers = {
        ...config.headers,
        authorization: 'Bearer ' + authToken,
      };

    try {
      const result = await axios.post(
        `${process.env.AUTH_BASE_URL}/validate-auth`,
        {
          url: req.url,
          method: req.method,
        },
        config,
      );
      return result.data;
    } catch (error) {
      return null;
    }
  }
}
