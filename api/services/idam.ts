import { AxiosResponse } from 'axios'
import { Request } from 'express'
import { http } from '../lib/http'

export async function getUserDetails(jwt: string,  url: string): Promise<AxiosResponse> {
    const axiosInstance = http({
      session: {
        auth: {
          token: jwt
        }
      }
    } as unknown as Request)

    return axiosInstance.get(`${url}/details`);
}
