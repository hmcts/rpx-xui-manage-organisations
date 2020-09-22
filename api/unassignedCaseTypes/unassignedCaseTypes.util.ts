import * as faker from 'faker'

export const searchCasesString = '/ccd/searchCases?ctid=FinancialRemedyConsentedRespondent,DIVORCE_XUI'

export function getApiPath(ccdPath: string) {
    return `${ccdPath}${searchCasesString}`
}

let caseTypeNumber
export const createCaseType = () => {
    const caseTypeId = `Casetype${caseTypeNumber++}`
    return {
        case_type_id: caseTypeId,
        total: caseTypeNumber !== 6 ? faker.random.number() : 0,
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
