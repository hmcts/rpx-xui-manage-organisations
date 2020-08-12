import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_CCD_DATA_STORE_API_PATH } from '../configuration/references'
import { createCaseTypeResponse, getApiPath } from './unassignedCases.util'

export async function handleUnassignedCaseTypes(req: Request, res: Response) {
    console.log(req.body)
    const payload = req.body

    const rdProfessionalApiPath = getApiPath(getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH))
    //const response = await req.http.post(rdProfessionalApiPath, payload)
    const response = createCaseTypeResponse()
    // console.log(response.data)
    res.send(response)
}

export const router = Router({ mergeParams: true })

router.post('', handleUnassignedCaseTypes)

export default router
