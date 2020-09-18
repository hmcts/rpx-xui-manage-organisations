import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_MCA_PROXY_API_PATH } from '../configuration/references'
import { getApiPath } from './unassingedCases-util'

export async function handleUnassignedCases(req: Request, res: Response) {
  const caseTypeId = req.query.caseTypeId.toString()
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), caseTypeId)
  const payload = req.body
  try {
        console.log('unassinged Cases Path is ', path)
        const response = await req.http.post(path, payload)
        res.send(response.data)
  } catch (error) {
      console.log(error)
      res.status(500)
  }
}

export const router = Router({ mergeParams: true })

router.post('', handleUnassignedCases)

export default router
