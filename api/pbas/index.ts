import { NextFunction, Response } from 'express'
import { handleDelete, handleGet, handlePost, handlePut } from '../common/mockService'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { EnhancedRequest } from '../lib/models'
import * as mock from './pbaService.mock'

mock.init()

const url: string = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)

export async function addPBA(req: EnhancedRequest, res: Response, next: NextFunction) {
  const markupPath: string = url + req.originalUrl
  const body: any = req.body

  try {
    const {status, data}: { status: number, data: any } = await handlePost(markupPath, body, req)
    res.status(status).send(data)
  } catch (error) {
    next(error)
  }
}

export async function deletePBA(req: EnhancedRequest, res: Response, next: NextFunction) {
  const markupPath: string = url + req.originalUrl
  const body: any = req.body

  try {
    const {status, data}: { status: number, data: any } = await handleDelete(markupPath, body, req)
    res.status(status).send(data)
  } catch (error) {
    next(error)
  }
}

export async function getPBA(req: EnhancedRequest, res: Response, next: NextFunction) {
  const markupPath: string = url + req.originalUrl
  const body: any = req.body

  try {
    const {status, data}: { status: number, data: any } = await handleGet(markupPath, req)
    res.status(status).send(data)
  } catch (error) {
    next(error)
  }
}

export async function updatePBA(req: EnhancedRequest, res: Response, next: NextFunction) {
  const markupPath: string = url + req.originalUrl
  const body: any = req.body

  try {
    const {status, data}: { status: number, data: any } = await handlePut(markupPath, body, req)
    res.status(status).send(data)
  } catch (error) {
    next(error)
  }
}
