import { CaseHeader, CcdCase, CcdCaseData, CcdColumnConfig, CaaCases } from './interfaces'
import { caseAssignment, caseId, caseTypeStr } from './caaCases.constants'
import { CaaCasesFilterType } from './enums';

export function getApiPath(ccdPath: string, caseTypeId: string) {
  return `${ccdPath}${caseAssignment}?ctid=${caseTypeId}&use_case=ORGCASES`;
}

export function mapCcdCases(caseType: string, ccdCase: CcdCase): CaaCases {
  const idField = '[CASE_REFERENCE]';
  const columnConfigs: CcdColumnConfig[] = mapCcdColumnConfigs(ccdCase);
  const data: any[] = mapCcdData(ccdCase, columnConfigs, caseType);
  return {
    columnConfigs,
    data,
    idField,
  };
}

export function getRequestBodyForAssignedCases(organisationID: string, pageNo: number, pageSize: number, caaCasesFilterType: string, caaCasesFilterValue: string) {
  const organisationAssignedUsersKey = `supplementary_data.orgs_assigned_users.${organisationID}`;
  const reference = 'reference.keyword';

  switch(caaCasesFilterType) {
    case CaaCasesFilterType.allAssignees:
      return {
        from: pageNo,
        query: {
          bool: {
            filter: [
              {
                multi_match: {
                  fields: ['data.*.Organisation.OrganisationID'],
                  query: `${organisationID}`,
                  type: 'phrase',
                },
              },
              {
                bool: {
                  must: [
                    { range: { [organisationAssignedUsersKey]: { gt: 0}}},
                  ],
                },
              },
            ],
          },
        },
        size: pageSize,
        sort: [
          {
            created_date: 'desc'
          },
        ]
      }
    case CaaCasesFilterType.assigneeName:
      // TODO: To be implemented/modified
      return {
        from: pageNo,
        query: {
          bool: {
            filter: [
              {
                multi_match: {
                  fields: ['data.*.Organisation.OrganisationID'],
                  query: `${organisationID}`,
                  type: 'phrase',
                },
              },
              {
                bool: {
                  must: [
                    { range: { [organisationAssignedUsersKey]: { gt: 0}}},
                  ],
                },
              },
            ],
          },
        },
        size: pageSize,
        sort: [
          {
            created_date: 'desc'
          },
        ]
      }
    case CaaCasesFilterType.caseReferenceNumber:
      return {
        from: pageNo,
        query: {
          bool: {
            must: [
              { match: { [reference]: caaCasesFilterValue }},
            ],
            filter: [
              {
                multi_match: {
                  fields: ['data.*.Organisation.OrganisationID'],
                  query: `${organisationID}`,
                  type: 'phrase',
                },
              },
              {
                bool: {
                  must: [
                    { range: { [organisationAssignedUsersKey]: { gt: 0}}},
                  ],
                },
              },
            ],
          },
        },
        size: pageSize,
        sort: [
          {
            created_date: 'desc'
          },
        ]
      }
    default:
      return {
        from: pageNo,
        query: {
          bool: {
            filter: [
              {
                multi_match: {
                  fields: ['data.*.Organisation.OrganisationID'],
                  query: `${organisationID}`,
                  type: 'phrase',
                },
              },
              {
                bool: {
                  must: [
                    { range: { [organisationAssignedUsersKey]: { gt: 0}}},
                  ],
                },
              },
            ],
          },
        },
        size: pageSize,
        sort: [
          {
            created_date: 'desc'
          },
        ]
      }
  }
}

export function getRequestBodyForUnassignedCases(organisationID: string, pageNo: number, pageSize: number, caaCasesFilterType: string, caaCasesFilterValue: string) {
  const organisationAssignedUsersKey = `supplementary_data.orgs_assigned_users.${organisationID}`
  const reference = 'reference.keyword';
  
  if (caaCasesFilterType === CaaCasesFilterType.caseReferenceNumber) {
    return {
      from: pageNo,
      query: {
        bool: {
          must: [
            { match: { [reference]: caaCasesFilterValue }},
          ],
          filter: [
            {
              multi_match: {
                fields: ['data.*.Organisation.OrganisationID'],
                query: `${organisationID}`,
                type: 'phrase',
              },
            },
            {
              bool: {
                must_not: [
                  { range: { [organisationAssignedUsersKey]: { gt: 0}}},
                ],
              },
            },
          ],
        },
      },
      size: pageSize,
      sort: [
        {
          created_date: 'desc'
        },
      ]
    };
  }

  return {
    from: pageNo,
    query: {
      bool: {
        filter: [
          {
            multi_match: {
              fields: ['data.*.Organisation.OrganisationID'],
              query: `${organisationID}`,
              type: 'phrase',
            },
          },
          {
            bool: {
              must_not: [
                { range: { [organisationAssignedUsersKey]: { gt: 0}}},
              ],
            },
          },
        ],
      },
    },
    size: pageSize,
    sort: [
      {
        created_date: 'desc'
      },
    ]
  };
}

function mapCcdData(ccdCase: CcdCase, columnConfigs: CcdColumnConfig[], caseType: string): any[] {
  const data = Array<any>();
  ccdCase.cases.forEach(caseData => data.push(onGeneratedRow(caseData, columnConfigs, caseType)));
  return data;
}

function onGeneratedRow(ccdCaseData: CcdCaseData, columnConfigs: CcdColumnConfig[], caseType: string) {
  const caaCase = {};
  columnConfigs.forEach(columnConfig => {
    if (!(typeof ccdCaseData.fields[columnConfig.key] === 'object')) {
      caaCase[columnConfig.key] = ccdCaseData.fields[columnConfig.key]
    } else {
      if (ccdCaseData.fields[columnConfig.key]) {
        caaCase[columnConfig.key] = ccdCaseData.fields[columnConfig.key].OrgPolicyReference
      }
    }
  });
  caaCase[caseId] = ccdCaseData.case_id;
  caaCase[caseTypeStr] = caseType;
  return caaCase;
}

function mapCcdColumnConfigs(ccdCases: CcdCase): CcdColumnConfig[] {
  const ccdColumnConfigs = new Array<CcdColumnConfig>();
  ccdCases.headers.forEach((caseHeader: CaseHeader) => {
    caseHeader.fields.forEach(header => {
      if (header) {
        ccdColumnConfigs.push({
          header: header.label,
          key: header.case_field_id,
          type: header.case_field_type.type === 'DateTime' ? 'date' : header.case_field_type.type,
        });
      }
    })
  });
  return ccdColumnConfigs;
}