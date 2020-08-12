import * as faker from 'faker'

export const searchCasesString = '/searchCases?ctid=DIVORCE'
let caseTypeNumber
export function getApiPath(ccdPath: string) {
    return `${ccdPath}${searchCasesString}`
}

export const createCaseType = () => {
    return {
        case_type_id: `CaseType${caseTypeNumber++}`,
        total: faker.random.number(),
    }
}

export const createCaseTypeResponse = () => {
    const cases = createCaseTypeData(5)
    return {
            case_types_results: cases,
            cases: [],
            total: faker.random.number(),
        }
}

export const createCaseTypeData = (numUsers = 4): any[] => {
    caseTypeNumber = 1
    return new Array(numUsers)
      .fill(undefined)
      .map(createCaseType)
}
