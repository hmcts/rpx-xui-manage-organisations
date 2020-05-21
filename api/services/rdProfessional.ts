import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'

import {Request} from 'express'
import { PaymentAccountDto } from '../lib/models/transactions'

const logger = log4jui.getLogger('rd-professional')

const url = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)

export async function getAccountsForOrganisation(orgId: string, req: Request): Promise<PaymentAccountDto[]> {
    const response = await req.http.get(`${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/organisations/${orgId}/pbas`)
    return response.data
}

/**
 * postOrganisation
 *
 * Hit when
 */
export async function postOrganisation(body: any, req: Request): Promise<any> {
    logger.info(`Post organisation body`)
    logger.debug(JSON.stringify(body))
    console.log('url')
    console.log(url)

    try {
        const response = await req.http.post(`${url}/refdata/external/v1/organisations`, body)
        return response.data

    } catch (error) {
        const errReport = {
            apiError: error.data.errorMessage,
            apiErrorDescription: error.data.errorDescription,
            statusCode: error.status,
        }
        return errReport
    }
}
