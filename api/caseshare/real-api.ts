import { AxiosResponse } from 'axios'
import { NextFunction, Response } from 'express'
import { EnhancedRequest } from '../models/enhanced-request.interface'
import { handleDelete, handleGet, handlePost } from '../common/crudService'
import { getConfigValue } from '../configuration'
import { SERVICES_MCA_PROXY_API_PATH, SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { ccdToUserDetails, prdToUserDetails } from './dtos/user-dto'
import { CaseAssigneeMappingModel } from './models/case-assignee-mapping.model'
import { SharedCase } from './models/case-share.model'
import { CCDRawCaseUserModel } from './models/ccd-raw-case-user.model'
import { UnassignedCaseModel } from './models/unassigned-case.model'
import { UserDetails } from './models/user-details.model'

const prdUrl: string = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
const ccdUrl: string = getConfigValue(SERVICES_MCA_PROXY_API_PATH)

export async function getUsers(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  try {
    const path = `${prdUrl}/refdata/external/v1/organisations/users?returnRoles=false&status=active`
    const {status, data}: {status: number, data: any} = await handleGet(path, req, next)
    const users = [...data.users]
                  .map(user => prdToUserDetails(user))
    return res.status(status).send(users)
  } catch (error) {
    next(error)
  }
}

export async function getCases(req: EnhancedRequest, res: Response, next: NextFunction): Promise<Response> {
  try {
    const caseIds = req.query.case_ids
    const path = `${ccdUrl}/case-assignments?case_ids=${caseIds}`
    const {status, data}: {status: number, data: any} = await handleGet(path, req, next)
    const caseUsers: CCDRawCaseUserModel[] = [...data.case_assignments]
    const sharedCases: SharedCase[] = []
    for (const caseUser of caseUsers) {
      const sharedCase: SharedCase = {
        caseId: caseUser.case_id,
        caseTitle: caseUser.case_title,
        sharedWith: caseUser.shared_with.map(rawSharedWith => ccdToUserDetails(rawSharedWith)),
      }
      sharedCases.push(sharedCase)
    }
    return res.status(status).send(sharedCases)
  } catch (error) {
    next(error)
  }
}

export async function assignCases(req: EnhancedRequest, res: Response): Promise<Response> {
  const shareCases: SharedCase[] = req.body.sharedCases.slice()

  // call share case api (the n call)
  const shareCasePromises: Promise<AxiosResponse>[] = doShareCase(req, shareCases)
  // Process any rejected responses and handle case shares
  // @ts-ignore
  const allShareCaseResults = await Promise.allSettled([...shareCasePromises])

  const shareCaseRejections: { updatedErrorMessages: string[],
    rejectedShareCasePayloads: CaseAssigneeMappingModel[],
    rejectedUnShareCaseReason: any,
    rejectedCount: number } = handleRejectedResponse(allShareCaseResults)

  const updatedSharedCases: SharedCase[] = handleSharedCase(shareCases, shareCaseRejections.rejectedShareCasePayloads)

  let unshareCaseRejection: { updatedErrorMessages: string[],
    rejectedShareCasePayloads: CaseAssigneeMappingModel[],
    rejectedUnShareCaseReason: any,
    rejectedCount: number }

  let finalSharedCases: SharedCase[]

  // Only call the unshare case API if there were no rejected share case responses. This is to avoid a potential
  // scenario where a case would be left unassigned if addition of a new sole user failed but deletion of all its
  // existing users was allowed to proceed
  if (shareCaseRejections.rejectedCount === 0) {
    // call unShare case api (the 1 batch call)
    const unShareCasePromise = doUnShareCase(req, shareCases)
    if (unShareCasePromise !== null) {
      // @ts-ignore
      const unshareCaseResult = await Promise.allSettled([unShareCasePromise])

      unshareCaseRejection = handleRejectedResponse(unshareCaseResult)
      finalSharedCases = handleUnSharedCase(updatedSharedCases, unshareCaseRejection.rejectedUnShareCaseReason)
    }
  }

  // when none of the apis returned successfully
  if (shareCasePromises.length > 0 && shareCasePromises.length === shareCaseRejections.rejectedCount) {
    return res.status(500).send(shareCaseRejections.updatedErrorMessages)
  } else if (unshareCaseRejection && unshareCaseRejection.rejectedCount === 1) {
    // Should be a count of only 1 because it's a single Promise
    return res.status(500).send(unshareCaseRejection.updatedErrorMessages)
  } else {
    return res.status(201).send(finalSharedCases && finalSharedCases.length > 0 ? finalSharedCases : updatedSharedCases)
  }
}

function doShareCase(req: EnhancedRequest, shareCases: SharedCase[]): Promise<AxiosResponse>[] {
  const path = `${ccdUrl}/case-assignments`
  const promises: Promise<AxiosResponse>[] = []
  // @ts-ignore
  shareCases.flatMap(sharedCase => {
    if (sharedCase && sharedCase.pendingShares && sharedCase.pendingShares.length > 0) {
      sharedCase.pendingShares.flatMap(pendingShare => {
        const caseAssigneeMappingModel: CaseAssigneeMappingModel = {
          assignee_id: pendingShare.idamId,
          case_id: sharedCase.caseId,
          case_type_id: sharedCase.caseTypeId,
        }
        const promise = handlePost(path, caseAssigneeMappingModel, req)
        promises.push(promise)
      })
    }
  })
  return promises
}

function doUnShareCase(req: EnhancedRequest, shareCases: SharedCase[]): Promise<AxiosResponse> {
  const path = `${ccdUrl}/case-assignments`
  const unassignedCaseModels: UnassignedCaseModel[] = []
  let promise: Promise<AxiosResponse> = null
  for (const aCase of shareCases) {
    if (aCase.pendingUnshares && aCase.pendingUnshares.length > 0) {
      const userDetails: UserDetails[] = aCase.pendingUnshares
      for (const aUser of userDetails) {
        const unassignedCaseModel: UnassignedCaseModel = {
          assignee_id: aUser.idamId,
          case_id: aCase.caseId,
          case_roles: aUser.caseRoles,
        }
        unassignedCaseModels.push(unassignedCaseModel)
      }
    }
  }
  const payload = {
    unassignments: unassignedCaseModels,
  }
  if (unassignedCaseModels.length > 0) {
    promise = handleDelete(path, payload, req)
  }
  return promise
}

function handleRejectedResponse(allResults: any[]):
  { updatedErrorMessages: string[],
    rejectedShareCasePayloads: CaseAssigneeMappingModel[],
    rejectedUnShareCaseReason: any,
    rejectedCount: number} {
  const updatedErrorMessages: string[] = []
  const rejectedShareCasePayloads: CaseAssigneeMappingModel[] = []
  let rejectedUnShareCaseReason: any = null
  let rejectedCount: number = 0

  allResults.forEach(result => {
    const {status, reason}: {status: string, reason: any} = result
    if (status === 'rejected') {
      if (reason.config.method === 'post') {
        rejectedShareCasePayloads.push(JSON.parse(reason.config.data))
      } else if (reason.config.method === 'delete') {
        rejectedUnShareCaseReason = reason
      }
      updatedErrorMessages.push(`{request: ${reason.config.data}, response: {${reason.data.status} ${reason.data.message}}}`)
      rejectedCount ++
    }
  })
  return { updatedErrorMessages, rejectedShareCasePayloads, rejectedUnShareCaseReason, rejectedCount }
}

function handleSharedCase(shareCases: SharedCase[], rejectedPayloads: CaseAssigneeMappingModel[]): SharedCase[] {
  const updatedSharedCases: SharedCase[] = []
  for (const aCase of shareCases) {
    const newPendingShares = aCase.pendingShares ? aCase.pendingShares.slice() : []
    const newSharedWith = aCase.sharedWith ? aCase.sharedWith.slice() : []
    for (let i = 0; i < newPendingShares.length; i++) {
      const foundFailed = rejectedPayloads.filter(rejectedPayload => rejectedPayload.case_id === aCase.caseId)
        .some(foundPayload => foundPayload.assignee_id === newPendingShares[i].idamId)
      // can't find on rejected payload that mean it's successfully shared
      if (!foundFailed) {
        // add to shared with
        newSharedWith.push(newPendingShares[i])
        // remove from pending shares
        newPendingShares.splice(i, 1)
        i--
      }
    }
    const newSharedCase = {
      ...aCase,
      pendingShares: newPendingShares,
      sharedWith: newSharedWith,
    }
    updatedSharedCases.push(newSharedCase)
  }
  return updatedSharedCases
}

function handleUnSharedCase(shareCases: SharedCase[], rejectedUnShareCaseReason: any): SharedCase[] {
  const updatedSharedCases: SharedCase[] = shareCases.slice()
  const returnSharedCases: SharedCase[] = []
  if (!rejectedUnShareCaseReason) {
    for (const aCase of updatedSharedCases) {
      if (aCase.pendingUnshares && aCase.pendingUnshares.length > 0) {
        const filteredArray = aCase.sharedWith.filter(user => !aCase.pendingUnshares.some(pUser => pUser.idamId === user.idamId))
        const newCase: SharedCase = {
          ...aCase,
          pendingUnshares: [],
          sharedWith: filteredArray,
        }
        returnSharedCases.push(newCase)
      } else {
        returnSharedCases.push(aCase)
      }
    }
    return returnSharedCases
  } else {
    return updatedSharedCases
  }
}
