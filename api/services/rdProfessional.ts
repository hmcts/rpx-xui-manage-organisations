import { config } from '../lib/config'
import * as log4jui from '../lib/log4jui'

import { http } from '../lib/http'
import { PaymentAccountDto } from '../lib/models/transactions'

const logger = log4jui.getLogger('rd-professional')

const url = config.services.rdProfessionalApi

export async function getOrganisationId(details) {
    // TODO remove the hardcoded email when correct user gets returned from idam
    // const email = details.data.email;
    const email = 'henry_fr_harper@yahoo.com'
    return await http.get(`${config.services.rdProfessionalApi}/search/organisations/${email}`)
}

export async function getAccountsForOrganisation(orgId: string): Promise<PaymentAccountDto[]> {
    const response = await http.get(`${config.services.rdProfessionalApi}/organisations/${orgId}/pbas`)
    return response.data
}

export async function postOrganisation(body: any): Promise<any> {
    logger.info(`Post organisation body`)
    logger.debug(JSON.stringify(body))

    try {
        const response = await http.post(`${url}/organisations`, body)
        return response.data

    } catch (e) {
        const errReport = {
            apiError: e.data.errorMessage,
            apiErrorDescription: e.data.errorDescription,
            statusCode: e.status,
        }
        return errReport
    }
}
