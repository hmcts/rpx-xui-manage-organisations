import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.get('/', healthCheckRoute)

const healthCheckEndpointDictionary = {
    '/organisation': ['idamWeb', 'rdProfessionalApi'],
}

function getEndpoints(path): string[] {
    const endpoints: string[] = []
    healthCheckEndpointDictionary[path].forEach(element => {
        endpoints.push(config.services[element] + '/health')
    })
    return endpoints
}

async function healthCheckRoute(req, res) {

    try {
        console.log(req.params)
        const path = req.params.path
        const PromiseArr = []
        let response = { healthState: true }
        console.log('Health check in progress')

        if (path !== '') {
            getEndpoints(path).forEach(element => {
                PromiseArr.push(http.get(element))
            })

        }

        await Promise.all(PromiseArr).then().catch(() => {
            console.log('Health check failed')
            response = { healthState: false }
        })

        logger.info('response::', response)
        res.send(response)
    } catch (error) {
        console.log(error)
        logger.info('error', { healthState: false })
        res.status(error.status).send({ healthState: false })
    }
}
export default router
