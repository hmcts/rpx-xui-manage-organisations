import * as log4jui from '../lib/log4jui'
import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'

const logger = log4jui.getLogger('service-token')

async function handleUserListRoute(req, res) {
    const orgId = req.session.auth.orgId
    //for testing hardcode your org id
    //const orgId = 'B13GT1M'
    try {
        const url = `${config.services.rdProfessionalApi}/refdata/external/v1/organisations/users`
        const response = await http.get(url)
        const amendedUsers = []

        response.data.users.forEach(element => {
            const fullName = element.firstName + ' ' + element.lastName
            const user = element
            user.fullName = fullName
            user.routerLink = 'user/' + user.userIdentifier
            amendedUsers.push(user)
        })

        logger.info('response::', {users: amendedUsers})
        res.send(response.data)
    } catch (error) {
        const errReport = JSON.stringify({
            apiError: error,
            apiStatusCode: error.statusCode,
            message: 'List of users route error',
        })
        res.send(errReport).status(500)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('/', handleUserListRoute)

export default router
