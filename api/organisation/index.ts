import * as express from 'express'
import config from '../lib/config'
import { http } from '../lib/http'

async function handleAddressRoute(req, res) {
    try {
        const response = await http.get(`${config.services.rdProfessionalApi}/organisations/${req.params.orgId}`)
        res.send(response.data)
    } catch (error) {
        const errReport = { apiError: error.data.message, apiStatusCode: error.status, message: 'Organsiation route error' }
        res.status(500).send(errReport)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('/:orgId', handleAddressRoute)

export default router
