import * as faker from 'faker'

export const caseAssignment = '/ccd/internal/searchCases'

export function getApiPath(ccdPath: string, caseTypeId: string) {
    return `${ccdPath}${caseAssignment}?ctid=<${caseTypeId}>&usecase=ORGCASES`
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

export function getRequestBody(organisationID: string) {
    return {
        from: 0,
        query: {
            bool: {
            filter: [
                {
                multi_match: {
                    fields: ["data.*.Organisation.OrganisationID"],
                    query: `<${organisationID}>`,
                    type: "phrase",
                },
                },
                {
                bool: {
                    should: [
                    {
                        range: {
                        'supplementary_data.orgs_assigned_users.<organisationID>': {
                            lte: 0,
                        },
                        },
                    },
                    {
                        bool: {
                        must_not: [
                            {
                            exists: {
                                field: 'supplementary_data.orgs_assigned_users.<organisationID>'
                            },
                            },
                        ],
                        },
                    },
                    {
                        bool: {
                        'must_not': [
                            {
                            'exists': {
                                'field': 'supplementary_data',
                            },
                            },
                        ],
                        },
                    },
                    ],
                },
                },
            ],
            },
        },
        sort: {
            "created_date": {order: 'desc'},
        },
    }
}
