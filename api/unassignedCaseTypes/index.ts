import { Request, Response, Router } from 'express'
import * as faker from 'faker'

export async function handleUnassignedCaseTypes(req: Request, res: Response) {
    const response = createCaseTypeResponse()
    console.log(response)
    res.send(response)
}

const createCaseType = () => {
    return {
        case_type_id: faker.commerce.department(),
        total: faker.random.number(),
    }
}

const createCaseTypeResponse = () => {
    const cases = createCaseTypeData(5)
    return {
        case_types_results: cases,
        cases: [],
        total: faker.random.number(),
    }
}

const createCaseTypeData = (numUsers = 4) => {
    return new Array(numUsers)
      .fill(undefined)
      .map(createCaseType)
  }

export const router = Router({ mergeParams: true })

router.get('', handleUnassignedCaseTypes)

export default router
