import { Request, Response, Router } from 'express'
import * as faker from 'faker'

export async function handleUnassignedCases(req: Request, res: Response) {
    const fakeUsers = createCaseData(5)
    res.send(fakeUsers)
}

const createCase = () => {
    return {
      caseCreatedDate: faker.date.past(),
      caseDueDate: faker.date.future(),
      caseRef: faker.random.uuid(),
      petFirstName: faker.name.firstName(),
      petLastName: faker.name.lastName(),
      respFirstName: faker.name.firstName(),
      respLastName: faker.name.lastName(),
      sRef: faker.random.uuid(),
    }
}

const createCaseData = (numUsers = 5) => {
    return new Array(numUsers)
      .fill(undefined)
      .map(createCase)
  }

export const router = Router({ mergeParams: true })

router.get('', handleUnassignedCases)

export default router
