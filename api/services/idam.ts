import { AxiosResponse } from 'axios'
import { http } from '../lib/http'
import { config } from '../lib/config'

export async function getUserDetails(jwt: string): Promise<AxiosResponse> {
    const options = {
        headers: { Authorization: `Bearer ${jwt}` },
    }

    return await http.get(`${config.services.idamApi}/details`, options)
}
