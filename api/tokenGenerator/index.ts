import { getConfigValue } from '../configuration';
import { http } from '../lib/http';
import { IDAM_CLIENT, IDAM_SECRET, SERVICES_IDAM_API_PATH } from '../configuration/references';
import { Request, Response, Router } from 'express';

export const router = Router({mergeParams: true})

export async function generateToken(req: Request, res: Response) {
    // replace userName
    const userName = ''
    // replace Password
    const userPassword = ''
    const scope = 'openid profile roles manage-user create-user'
    const clientSecret = getConfigValue(IDAM_SECRET)
    const idamClient = getConfigValue(IDAM_CLIENT)
    const url = `${getConfigValue(SERVICES_IDAM_API_PATH)}/o/token?grant_type=password&password=${userPassword}&username=${userName}&scope=${scope}&client_id=${idamClient}&client_secret=${clientSecret}`

    const axiosInstance = http({} as unknown as Request)
    try {
      const response = await axiosInstance.post(url)
      res.status(response.status).send(response.data)
    } catch(error) {
      console.log(error)
      res.status(error.status).send(error.data)
    }
}

router.get('', generateToken)

export default router
