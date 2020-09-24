import * as faker from 'faker'
import {CaseHeader, CcdCase, CcdCaseData, CcdColumnConfig, UnAssignedCases} from './interfaces/index'

export const caseAssignment = '/ccd/internal/searchCases'

export function getApiPath(ccdPath: string, caseTypeId: string) {
    return `${ccdPath}${caseAssignment}?ctid=${caseTypeId}&use_case=ORGCASES`
}

export function mapCcdCases(ccdCase: CcdCase): UnAssignedCases {
    const idField = 'CASE_REFERENCE'
    const columnConfigs: CcdColumnConfig[]  = mapCcdColumnConfigs(ccdCase)
    const data: any[] = mapCcdData(ccdCase, columnConfigs)
    return {
        columnConfigs,
        data,
        idField,
    }
}

function mapCcdData(ccdCase: CcdCase, columnConfigs: CcdColumnConfig[]): any[] {
    const data = Array<any>()
    ccdCase.cases.forEach(caseData => data.push(onGeneratedRow(caseData, columnConfigs)))
    return data
}

function onGeneratedRow(ccdCaseData: CcdCaseData, columnConfigs: CcdColumnConfig[]) {
    const unassingedCase = {}
    columnConfigs.forEach(columnConfig => {
        if (!(typeof ccdCaseData.fields[columnConfig.key] === 'object')) {
            unassingedCase[columnConfig.key] = ccdCaseData.fields[columnConfig.key]
        }
    })
    return unassingedCase
 }

function mapCcdColumnConfigs(ccdCases: CcdCase): CcdColumnConfig[] {
    const ccdColumnConfigs = new Array<CcdColumnConfig>()
    ccdCases.headers.forEach((caseHeader: CaseHeader) => {
        caseHeader.fields.forEach(header => {
            if (header.metadata) {
                ccdColumnConfigs.push({
                    header: header.label,
                    key: header.case_field_id,
                    type: header.case_field_type.type,
                })
            }
        })
    })
    return ccdColumnConfigs
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
                    query: `${organisationID}`,
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
        size: 100,
        sort: {
            "created_date": {order: 'desc'},
        },
    }
}

 // Mock Data generation methods

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
