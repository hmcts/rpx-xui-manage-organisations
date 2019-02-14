import * as log4js from 'log4js'
import config from '../lib/config'
import { http } from '../lib/http'

const logger = log4js.getLogger('rd-professional')
logger.level = config.logging || 'off'

const url = config.services.rd_professional_api

export async function postOrganisation(body: any): Promise<any> {
  logger.log('posting organisation', body)
  const response = await http.post(`${url}/organisations`, body)
  return response.data
}