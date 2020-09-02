import { AxiosResponse } from 'axios'
import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { http } from '../lib/http'

async function handleAddressRoute(req: express.Request, res: express.Response) {
    try {
        const response = await req.http.get(
          `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations`
        )
        console.log('response')
        console.log(response.data)
        res.send(response.data)
    } catch (error) {
        const errReport = { apiError: error.data.message, apiStatusCode: error.status, message: 'Organsiation route error' }
        res.status(500).send(errReport)
    }
}

export function getOrganisationDetails(jwt: string, roles: string[], url: string): Promise<AxiosResponse> {
    console.log('getOrganisationDetails');
    const axiosInstance = http({
        session: {
          auth: {
            roles,
            token: jwt,
          },
        },
      } as any)
    return axiosInstance.get(`${url}/refdata/external/v1/organisations`)
}

export const router = express.Router({ mergeParams: true })

router.get('', handleAddressRoute)

export default router
