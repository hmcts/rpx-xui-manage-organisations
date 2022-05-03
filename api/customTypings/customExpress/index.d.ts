import {AxiosInstance} from 'axios'

// use declaration merging to type http onto express request
declare global {
  namespace Express {
    interface Request {
      http: AxiosInstance;
      session: {
        auth: { [key: string]: any };
        passport: { [key: string]: any };
      }
    }
  }
}
