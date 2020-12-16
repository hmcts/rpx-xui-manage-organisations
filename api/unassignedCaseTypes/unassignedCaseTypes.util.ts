import { searchCasesString } from "./unassignedCaseTypes-constants"

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
