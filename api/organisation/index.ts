import { AxiosResponse } from 'axios'
import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'

export async function handleOrganisationRoute(req, res:Response) {
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

export function getOrganisationDetails(req, url: string): Promise<AxiosResponse> {
    console.log(' ~~~~~~~~~inside the getOrganisationDetails ', `${url}/refdata/external/v1/organisations`)
    return req.http.get(`${url}/refdata/external/v1/organisations`)
}

export const router = Router({ mergeParams: true })

router.get('', handleOrganisationRoute)

export default router
