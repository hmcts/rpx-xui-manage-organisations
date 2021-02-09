import { AxiosResponse } from 'axios'
import { NextFunction, Request } from 'express'
import * as log4jui from '../lib/log4jui'
import { JUILogger } from '../lib/models'

const logger: JUILogger = log4jui.getLogger('crud-service')

/**
 * Generic handleGet call Rest API with GET method
 * @param path
 * @param req
 * @param next
 * @returns {Promise<AxiosResponse>}
 */
export async function handleGet(path: string, req: Request, next: NextFunction): Promise<AxiosResponse> {
  try {
    logger.info('handle get:', path)
    return await req.http.get(path)
  } catch (e) {
    next(e)
  }
}

/**
 * Generic handlePost call Rest API with POST method
 * @param path
 * @param body
 * @param req
 * @returns {Promise<AxiosResponse>}
 */
export async function handlePost<T>(path: string, body: T, req: Request): Promise<AxiosResponse> {
  try {
    logger.info('handle post:', path)
    return await req.http.post(path, body)
  } catch (e) {
    logger.error(e.status, e.statusText, JSON.stringify(e.data))
    throw e
  }
}

/**
 * Generic handlePut call Rest API with PUT method
 * @param path
 * @param body
 * @param req
 * @returns {Promise<AxiosResponse>}
 */
export async function handlePut<T>(path: string, body: T, req: Request): Promise<AxiosResponse> {
  try {
    logger.info('handle put:', path)
    return await req.http.put(path, body)
  } catch (e) {
    logger.error(e.status, e.statusText, JSON.stringify(e.data))
    throw e
  }

}

/**
 * Generic handleDelete call Rest API with DELETE method
 * @param path
 * @param body
 * @param req
 * @returns {Promise<AxiosResponse>}
 */
export async function handleDelete<T>(path: string, body: T, req: Request): Promise<AxiosResponse> {
  try {
    logger.info('handle delete:', path)
    return await req.http.delete(path, {
      data: body,
    })
  } catch (e) {
    logger.error(e.status, e.statusText, JSON.stringify(e.data))
    throw e
  }
}
