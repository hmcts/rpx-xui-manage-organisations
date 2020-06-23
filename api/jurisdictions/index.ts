import { Router } from 'express'
import { getConfigValue } from '../configuration'
import { JURISDICTIONS } from '../configuration/references'

/**
 * getJurisdiction
 *
 * TODO: Test if this is working correctly.
 *
 * @param jurisdictionFromConfig - [
 * 'SSCS',
 * 'AUTOTEST1',
 * 'DIVORCE',
 * 'PROBATE',
 * 'PUBLICLAW',
 * 'bulkscan',
 * 'BULKSCAN',
 * 'IA',
 * 'EMPLOYMENT',
 * 'CMC'
 * ]
 * @return - [
 *  {id: 'SSCS'},
 *  {id: 'AUTOTEST1'},
 *  {id: 'DIVORCE'},
 *  {id: 'PROBATE'},
 *  {id: 'PUBLICLAW'},
 *  {id: 'bulkscan'},
 *  {id: 'BULKSCAN'},
 *  {id: 'IA'},
 *  {id: 'EMPLOYMENT'},
 *  {id: 'CMC'}
 * ]
 *
 */
const formatJurisdictions = jurisdictionFromConfig => jurisdictionFromConfig.map(jurisdiction => ({ id: jurisdiction }))

export async function handleJurisdictions(req, res) {

    const uiJurisdictions = formatJurisdictions(getConfigValue(JURISDICTIONS))

    try {
        res.send(uiJurisdictions)
    } catch (error) {
        const errReport = JSON.stringify({
            apiError: error,
            apiStatusCode: error.statusCode,
            message: 'List of jurisdictions route error',
        })
        res.send(errReport).status(error.statusCode)
    }
}

export const router = Router({ mergeParams: true })

router.get('/', handleJurisdictions)

export default router
