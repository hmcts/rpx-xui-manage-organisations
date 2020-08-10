import * as faker from 'faker'

export const searchCasesString = '/searchCases?ctid=DIVORCE'

export function getApiPath(ccdPath: string) {
    return `${ccdPath}${searchCasesString}`
}

export const createCaseType = () => {
    return {
        case_type_id: faker.commerce.department(),
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

export const createCaseTypeData = (numUsers = 4) => {
    return new Array(numUsers)
      .fill(undefined)
      .map(createCaseType)
}
