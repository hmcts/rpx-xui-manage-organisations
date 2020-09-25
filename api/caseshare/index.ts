import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model'
import { Request, Response } from 'express'
import { getConfigValue } from '../configuration'
import {
  SERVICES_MCA_PROXY_API_PATH,
  STUB
} from '../configuration/references'
import * as stubAPI from './stub-api'

const stub: boolean = getConfigValue(STUB)

/**
 * getRoot
 * example: /api/caseshare/
 */
export async function getRoot(req: Request, res: Response) {
  if (stub) {
    return stubAPI.getRoot(req, res)
  } else {
    // TODO: call actual API if not for stub
    return res.status(500).send('{"errorMessage": "Yet to implement}"')
  }
}

/**
 * getDB
 * example: /api/caseshare/db
 */
export async function getDB(req: Request, res: Response) {
  if (stub) {
    return stubAPI.getDB(req, res)
  } else {
    // TODO: call actual API if not for stub
    return res.status(500).send('{"errorMessage": "Yet to implement}"')
  }
}

/**
 * getOrgs
 * example: /api/caseshare/orgs
 */
export async function getOrgs(req: Request, res: Response) {
  if (stub) {
    return stubAPI.getOrgs(req, res)
  } else {
    // TODO: call actual API if not for stub
    return res.status(500).send('{"errorMessage": "Yet to implement}"')
  }
}

/**
 * getUsersByOrgId
 * example: /api/caseshare/orgs/o111111/users
 */
export async function getUsersByOrgId(req: Request, res: Response) {
  if (stub) {
    return stubAPI.getUsersByOrgId(req, res)
  } else {
    // TODO: call actual API if not for stub
    return res.status(500).send('{"errorMessage": "Yet to implement}"')
  }
}

/**
 * getUserByOrgAndUserId
 * example: /api/caseshare/orgs/o111111/users/u111111
 */
export async function getUserByOrgAndUserId(req: Request, res: Response) {
  if (stub) {
    return stubAPI.getUserByOrgAndUserId(req, res)
  } else {
    // TODO: call actual API if not for stub
    return res.status(500).send('{"errorMessage": "Yet to implement}"')
  }
}

/**
 * searchUsers
 * example 1: /api/caseshare/orgs
 */
export async function getUsers(req: Request, res: Response) {
  if (stub) {
    return stubAPI.getUsers(req, res)
  } else {
    // return realAPI.getUsers(req, res)
  }
}

/**
 * searchUsers
 * example: /api/caseshare/cases
 */
export async function getCases(req: Request, res: Response) {
  if (stub) {
    return stubAPI.getCases(req, res)
  } else {
    // return realAPI.getCases(req, res)
  }
}

/**
 * searchUsers
 * example: /api/caseshare/cases/c111111
 */
export async function getCaseById(req: Request, res: Response) {
  if (stub) {
    return stubAPI.getCaseById(req, res)
  } else {
    // TODO: call actual API if not for stub
    return res.status(500).send('{"errorMessage": "Yet to implement}"')
  }
}

export async function assignCases(req: Request, res: Response) {
  const shareCases: SharedCase[] = req.body.sharedCases.slice()
  const updatedSharedCases: SharedCase[] = []
  const errorMessages: string[] = []
  // call share case api
  await doShareCase(req, shareCases, updatedSharedCases, errorMessages)
  // TODO: call unshare case api
  // await doUnshareCase(req, shareCases, updatedSharedCases)
  const originalSharedNumber = shareCases.reduce((acc, aCase) => acc
    + (aCase.pendingShares ? aCase.pendingShares.length : 0), 0)
  const afterSharedNumber = updatedSharedCases.reduce((acc, aCase) => acc
    + (aCase.pendingShares ? aCase.pendingShares.length : 0), 0)
  // when none of the users are assigned successfully
  if (originalSharedNumber > 0 && originalSharedNumber === afterSharedNumber) {
    return res.status(500).send(errorMessages)
  }
  return res.status(201).send(updatedSharedCases)
}

async function doShareCase(req: Request, shareCases: SharedCase[],
                           updatedSharedCases: SharedCase[],
                           errorMessage: string[]) {
  const ccdUrl = getConfigValue(SERVICES_MCA_PROXY_API_PATH)
  const path = `${ccdUrl}/case-assignments`
  for (const aCase of shareCases) {
    const newPendingShares = aCase.pendingShares ? aCase.pendingShares.slice() : []
    const newSharedWith = aCase.sharedWith ? aCase.sharedWith.slice() : []
    if (aCase.pendingShares) {
      for (const pendingShare of aCase.pendingShares) {
        const payload = {
        'assignee_id': pendingShare.idamId,
        'case_id': aCase.caseId,
        'case_type_id': aCase.caseTypeId,
        }
        // logger.info('Request payload:', JSON.stringify(payload))
        try {
          const {status}: { status: number } = await req.http.post(path, payload)
          if (status === 201) {
          newSharedWith.push(pendingShare)
          newPendingShares.splice(newPendingShares.findIndex(iShare => iShare.idamId === pendingShare.idamId), 1)
          }
        } catch (error) {
          // logger.error('Error message:', JSON.stringify(error.data))
          errorMessage.push(`${error.status} ${error.statusText} ${JSON.stringify(error.data)}`)
        }
      }
    }
    const newSharedCase = {
    ...aCase,
    pendingShares: newPendingShares,
    sharedWith: newSharedWith,
    }
    updatedSharedCases.push(newSharedCase)
  }
}
