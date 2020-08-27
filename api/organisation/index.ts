import { AxiosResponse } from 'axios'
import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { http } from '../lib/http'

export async function handleOrganisationRoute(req: Request, res: Response) {
    try {
        const response = await req.http.get(
          `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations`
        )
        res.send(response.data)
    } catch (error) {
        const errReport = {
            apiError: error.data.message,
            apiStatusCode: error.status,
            message: 'Organisation route error',
        }
        res.status(errReport.apiStatusCode).send(errReport)
    }
}

export function getOrganisationDetails(jwt: string, roles: string[], url: string): Promise<AxiosResponse> {
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

export const router = Router({ mergeParams: true })

router.get('', handleOrganisationRoute)

export default router
