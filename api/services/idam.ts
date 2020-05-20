import { AxiosResponse } from 'axios'
import { http } from '../lib/http'

export async function getUserDetails(jwt: string,  url: string): Promise<AxiosResponse> {
    const options = {
        headers: { Authorization: `Bearer ${jwt}` },
    }

    return await http.get(`${url}/details`, options)
}
