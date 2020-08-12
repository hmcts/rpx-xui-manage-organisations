import { Request, Response, Router } from 'express'
import * as faker from 'faker'
let caseTypeNumber
export async function handleUnassignedCases(req: Request, res: Response) {
    caseTypeNumber = 1
    const fakeUsers = createCases()
    res.send(fakeUsers)
}

const createCase = (caseId) => {
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

  let casesArr = [];
  casesArr.push(createCase('1573922332670942'));
  casesArr.push(createCase('1573925439311211'));
  casesArr.push(createCase('1574006431043307'));

  return casesArr;
}
export const router = Router({ mergeParams: true })

router.get('', handleUnassignedCases)

export default router
