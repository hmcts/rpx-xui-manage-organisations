import * as faker from 'faker'

export const searchCasesString = '/searchCases?ctid=*'

export function getApiPath(ccdPath: string) {
    return `${ccdPath}${searchCasesString}`
}

let caseTypeNumber
let caseNumber

const createCase = () => {
    return {
      caseCreatedDate: faker.date.past(),
      caseDueDate: faker.date.future(),
      caseRef: `caseRef${++caseNumber}`,
      caseType: `Casetype${caseTypeNumber}`,
      petFirstName: faker.name.firstName(),
      petLastName: faker.name.lastName(),
      respFirstName: faker.name.firstName(),
      respLastName: faker.name.lastName(),
      sRef: faker.random.uuid()
    }
}

export const createCases = (numUsers = 5): any [] => {
    caseTypeNumber = 1
    caseNumber = 0
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
