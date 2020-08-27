import { Router } from 'express'
import { getConfigValue, hasConfigValue } from '../configuration'

export async function handleAddressRoute(req, res) {
    console.log('req.query.configurationKey', hasConfigValue(req.query.configurationKey))
    if (hasConfigValue(req.query.configurationKey)) {
        const configurationValue = getConfigValue(req.query.configurationKey)
        res.send(configurationValue)
    } else {
        const errReport = {
            apiStatusCode: 400,
            message: `Missing Key not found for ${req.query.configurationKey}`,
        }
        res.status(errReport.apiStatusCode).send(errReport)
        return
    }
}

export const router = Router({ mergeParams: true })
router.get('', handleAddressRoute)
export default router
