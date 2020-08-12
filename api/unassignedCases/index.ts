import { Request, Response, Router } from 'express'
import * as faker from 'faker'
let caseTypeNumber
export async function handleUnassignedCases(req: Request, res: Response) {
    caseTypeNumber = 1
    const fakeUsers = createCases()
    res.send(fakeUsers)
}

const createCase = () => {
    return {
      caseCreatedDate: faker.date.past(),
      caseDueDate: faker.date.future(),
      caseRef: faker.random.uuid(),
      caseType: `CaseType${caseTypeNumber}`,
      petFirstName: faker.name.firstName(),
      petLastName: faker.name.lastName(),
      respFirstName: faker.name.firstName(),
      respLastName: faker.name.lastName(),
      sRef: faker.random.uuid(),
    }
}

const createCases = (numUsers = 5): any [] => {
  const cases = createCaseData(5)
  caseTypeNumber++
  cases.push(...createCaseData(5))
  caseTypeNumber++
  cases.push(...createCaseData(5))
  caseTypeNumber++
  cases.push(...createCaseData(5))
  return cases
}

const createCaseData = (numUsers = 5): any [] => {
    return new Array(numUsers)
      .fill(undefined)
      .map(createCase)
  }

export const router = Router({ mergeParams: true })

router.get('', handleUnassignedCases)

export default router
