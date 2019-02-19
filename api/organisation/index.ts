import * as express from 'express'
import { http } from '../lib/http'
import config from '../lib/config'


async function handleAddressRoute(req, res) {
    console.log('address route reached')

    //to do Organisation id is hard coded for now
    try {
        const response = await http.get(`${config.services.rd_professional_api}/organisations/b4775ea1-4036-4d7b-bebd-0b7cdc3c786f`)
        res.send(response.data)
    } catch (error) {

        const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: 'Organsiation not valid.' })
        console.error(errReport)
        res.status(500).send(errReport)
    }

}

export const router = express.Router({ mergeParams: true })

router.get('/address', handleAddressRoute)

export default router