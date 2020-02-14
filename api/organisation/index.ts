import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { http } from '../lib/http'

async function handleAddressRoute(req, res) {
    try {
        const response = await http.get(
          `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations`
        )
        res.send(response.data)
    } catch (error) {
        const errReport = { apiError: error.data.message, apiStatusCode: error.status, message: 'Organsiation route error' }
        res.status(500).send(errReport)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('', handleAddressRoute)

export default router
