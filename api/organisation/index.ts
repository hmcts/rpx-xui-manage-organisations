import * as express from 'express'
import { http } from '../lib/http'
import config from '../lib/config'
import { Logger } from 'log4js';


async function handleAddressRoute(req, res) {

    try {
        const response = await http.get(`${config.services.rd_professional_api}/organisations/${req.params.orgId}`)
        res.send(response.data)
    } catch (error) {
        const errReport = { apiError: error.data.message, apiStatusCode: error.status, message: 'Organsiation route error' }
        res.status(500).send(errReport)
    }

}

export const router = express.Router({ mergeParams: true })

router.get('/:orgId', handleAddressRoute)

export default router