import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.get('/', healthCheckRoute)

const healthCheckEndpointDictionary = {
    '/organisation': ['rdProfessionalApi'],
    '/register-org/register/check': ['rdProfessionalApi'],
    '/users': ['rdProfessionalApi'],
    '/users/invite-user': ['rdProfessionalApi'],
}

function getPromises(path): any[] {
    const Promises = []
    if (healthCheckEndpointDictionary[path]) {
        healthCheckEndpointDictionary[path].forEach(element => {
            Promises.push(http.get(config.health[element]))
        })
    }
    return Promises
}

async function healthCheckRoute(req, res) {

    try {
        const path = req.query.path
        let PromiseArr = []
        let response = { healthState: true }

        if (path !== '') {
            PromiseArr = getPromises(path)
        }

        await Promise.all(PromiseArr).then().catch(() => {
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
