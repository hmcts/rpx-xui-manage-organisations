import * as faker from 'faker'

export const searchCasesString = '/searchCases?ctid=DIVORCE'

export function getApiPath(ccdPath: string) {
    return `${ccdPath}${searchCasesString}`
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
