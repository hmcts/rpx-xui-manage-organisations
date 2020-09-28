import * as faker from 'faker'

export const searchCasesString = '/ccd/searchCases?ctid='

export function getRequestBody(organisationID: string) {
    const rangeKey = `supplementary_data.orgs_assigned_users.${organisationID}`
    return {
        _source: false,
        from: 0,
        query: {
           bool: {
            filter: [
                {
                    multi_match: {
                        fields: ["data.*.Organisation.OrganisationID"],
                        query: `${organisationID}`,
                        type: "phrase",
                    },
                },
                {
                    bool: {
                        should: [
                                { range: { rangeKey: { lte: 0 } } },
                                { bool: { must_not: [ { exists: { field: `supplementary_data.orgs_assigned_users.${organisationID}` } }] } },
                                { bool: { must_not: [ { exists: { field: "supplementary_data" } }] } },
                        ],
                    },
                },
            ],
           },
        },
        size: 100,
        sort: {
           created_date: {
              order: 'desc',
           },
        },
     }
}

export function getApiPath(ccdPath: string, caseTypes: string) {
    return `${ccdPath}${searchCasesString}${caseTypes}`
}

 // Mock Data generation methods

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
