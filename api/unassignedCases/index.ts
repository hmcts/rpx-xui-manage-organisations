import { Request, Response, Router } from 'express'
import * as faker from 'faker'

export async function handleUnassignedCases(req: Request, res: Response) {
    const fakeUsers = createCaseData(5)
    res.send(fakeUsers)
}

const createCase = (caseId) => {
    return {
      caseCreatedDate: faker.date.past(),
      caseDueDate: faker.date.future(),
      caseRef: caseId,
      petFirstName: faker.name.firstName(),
      petLastName: faker.name.lastName(),
      respFirstName: faker.name.firstName(),
      respLastName: faker.name.lastName(),
      sRef: faker.random.uuid(),
    }
}

const createCaseData = (numUsers = 5) => {

  let casesArr = [];
  casesArr.push(createCase('1573922332670942'));
  casesArr.push(createCase('1573925439311211'));
  casesArr.push(createCase('1574006431043307'));

  return casesArr;
}
export const router = Router({ mergeParams: true })

router.get('', handleUnassignedCases)

export default router
