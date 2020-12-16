import {CaseHeader, CcdCase, CcdCaseData, CcdColumnConfig, UnAssignedCases} from './interfaces/index'
import { caseAssignment, caseId, caseTypeStr } from './unassingedCases-constants'

export function getApiPath(ccdPath: string, caseTypeId: string) {
    return `${ccdPath}${caseAssignment}?ctid=${caseTypeId}&use_case=ORGCASES`
}

export function mapCcdCases(caseType: string, ccdCase: CcdCase): UnAssignedCases {
    const idField = '[CASE_REFERENCE]'
    const columnConfigs: CcdColumnConfig[]  = mapCcdColumnConfigs(ccdCase)
    const data: any[] = mapCcdData(ccdCase, columnConfigs, caseType)
    return {
        columnConfigs,
        data,
        idField,
    }
}

function mapCcdData(ccdCase: CcdCase, columnConfigs: CcdColumnConfig[], caseType: string): any[] {
    const data = Array<any>()
    ccdCase.cases.forEach(caseData => data.push(onGeneratedRow(caseData, columnConfigs, caseType)))
    return data
}

function onGeneratedRow(ccdCaseData: CcdCaseData, columnConfigs: CcdColumnConfig[], caseType: string) {
    const unassingedCase = {}
    columnConfigs.forEach(columnConfig => {
        if (!(typeof ccdCaseData.fields[columnConfig.key] === 'object')) {
            unassingedCase[columnConfig.key] = ccdCaseData.fields[columnConfig.key]
        } else {
            if (ccdCaseData.fields[columnConfig.key]) {
                unassingedCase[columnConfig.key] = ccdCaseData.fields[columnConfig.key].OrgPolicyReference
            }
        }
    })
    unassingedCase[caseId] = ccdCaseData.case_id
    unassingedCase[caseTypeStr] = caseType
    return unassingedCase
 }

function mapCcdColumnConfigs(ccdCases: CcdCase): CcdColumnConfig[] {
    const ccdColumnConfigs = new Array<CcdColumnConfig>()
    ccdCases.headers.forEach((caseHeader: CaseHeader) => {
        caseHeader.fields.forEach(header => {
            if (header) {
                ccdColumnConfigs.push({
                    header: header.label,
                    key: header.case_field_id,
                    type: header.case_field_type.type === 'DateTime' ? 'date' : header.case_field_type.type,
                })
            }
        })
    })
    return ccdColumnConfigs
}

export function getRequestBody(organisationID: string) {
    const rangeKey = `supplementary_data.orgs_assigned_users.${organisationID}`
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
            "created_date": {order: 'desc'},
        },
    }
}
