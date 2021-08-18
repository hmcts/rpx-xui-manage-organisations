import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model'
import { UserDetails } from '@hmcts/rpx-xui-common-lib/lib/models/user-details.model'
import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { DataBaseModel } from './models/data-base.model'
import { OrganisationModel } from './models/organisation.model'
// @ts-ignore
import * as dbJson from './stubs/db.json'

const dbModule = plainToClass(DataBaseModel, dbJson)
const orgs: OrganisationModel[] = dbModule.organisations
const cases: SharedCase[] = dbModule.sharedCases

export function getRoot(req: Request, res: Response) {
  return res.status(400).send('{"errorMessage": "Bad request}"')
}

export function getDB(req: Request, res: Response) {
  return res.send(dbJson)
}

export function getOrgs(req: Request, res: Response) {
  if (!orgs) {
    return res.status(404).send('{"errorMessage": "Organisations are not found}"')
  }
  return res.send(orgs)
}

export function getUsersByOrgId(req: Request, res: Response) {
    const org = getOrgById(req.params.orgId)
    if (!org) {
      return res.status(404).send('{"errorMessage": "Organisation is not found}"')
    }
    const users: UserDetails[] = org.users
    if (!users) {
      return res.status(404).send('{"errorMessage": "Users is not found}"')
    }
    return res.send(users)
}

export function getUserByOrgAndUserId(req: Request, res: Response) {
    const org = getOrgById(req.params.orgId)
    if (!org) {
      return res.status(404).send('{"errorMessage": "Organisation is not found}"')
    }
    const users: UserDetails[] = org.users
    const user = users.find(u => u.idamId === req.params.uid)
    if (!user) {
      return res.status(404).send('{"errorMessage": "User is not found}"')
    }
    return res.send(user)
}

export function getUsers(req: Request, res: Response) {
    const org = getOrgById('o111111')
    if (!org) {
      return res.status(404).send('{"errorMessage": "Organisation is not found}"')
    }
    return res.send(org.users)
}

export function getCases(req: Request, res: Response) {
    if (!cases) {
      return res.status(404).send('{"errorMessage": "Cases are not found}"')
    }
    return res.send(cases)
}

export function getCaseById(req: Request, res: Response) {
    if (!cases) {
      return res.status(404).send('{"errorMessage": "Cases are not found}"')
    }
    const foundCase = cases.find(aCase => aCase.caseId === req.params.caseId)
    if (!foundCase) {
      return res.status(404).send('{"errorMessage": "Case is not found}"')
    }
    return res.send(foundCase)
}

export function assignCases(req: Request, res: Response) {
  const shareCases: SharedCase[] = req.body.sharedCases.slice()
  const updatedSharedCases: SharedCase[] = []
  for (const aCase of shareCases) {
    let newPendingShares = aCase.pendingShares.slice()
    const newSharedWith = aCase.sharedWith.slice()
    for (const user of aCase.pendingShares) {
      const assignmentId = user.idamId
      if (assignmentId === 'u222222') {
        newSharedWith.push(user)
        newPendingShares = []
        // tslint:disable-next-line:no-empty
      } else  if (assignmentId === 'u333333') {
      } else  {
        return res.sendStatus(500)
      }
    }
    const newSharedCase = {
      ...aCase,
      pendingShares: newPendingShares,
      sharedWith: newSharedWith,
    }
    updatedSharedCases.push(newSharedCase)
  }
  return res.send(updatedSharedCases)
}

function getOrgById(orgId: string) {
  return orgs.find(c => c.orgId === orgId)
}
