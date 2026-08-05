import { caseAssignment, caseId, caseTypeStr } from './caaCases.constants';
import { CaaCasesFilterType, CaaCasesPageType } from './enums';
import { CaaCases, CaseHeader, CcdCase, CcdCaseData, CcdColumnConfig } from './interfaces';

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
    idField
  };
}

export function getRequestBody(organisationID: string, pageNo: number, pageSize: number, caaCasesPageType: string, caseFilterType: string, caaCasesFilterValue?: string | string[]) {
  const organisationAssignedUsersKey = `supplementary_data.orgs_assigned_users.${organisationID}`;
  const newCasesKey = `supplementary_data.new_case.${organisationID}`;
  const reference = 'reference.keyword';
  const caseReferenceFilter: any[] = [];
  if (caseFilterType === CaaCasesFilterType.NewCasesToAccept){
    caaCasesPageType = CaaCasesPageType.NewCasesToAccept;
  }
  if (caaCasesFilterValue) {
    if (Array.isArray(caaCasesFilterValue)) {
      caaCasesFilterValue.forEach((caseReference) => {
        caseReferenceFilter.push({ match: { [reference]: caseReference } });
      });
    } else {
      caseReferenceFilter.push({ match: { [reference]: caaCasesFilterValue } });
    }
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
              type: 'phrase'
            }
          },
          {
            bool: {
              ...((caaCasesPageType === CaaCasesPageType.AssignedCases && !caaCasesFilterValue) && {
                must: [
                  { range: { [organisationAssignedUsersKey]: { gt: 0 } } },
                  {
                    bool: {
                      should: [
                        { bool: { must_not: { exists: { field: newCasesKey } } } },
                        { term: { [newCasesKey]: false } }
                      ],
                      minimum_should_match: 1
                    }
                  }
                ]
              }),
              ...((caaCasesPageType === CaaCasesPageType.UnassignedCases && !caaCasesFilterValue) && {
                must: [
                  {
                    bool: {
                      should: [
                        { term: { [organisationAssignedUsersKey]: 0 } },
                        { bool: { must_not: { exists: { field: organisationAssignedUsersKey } } } }
                      ],
                      minimum_should_match: 1
                    }
                  },
                  {
                    bool: {
                      should: [
                        { bool: { must_not: { exists: { field: newCasesKey } } } },
                        { term: { [newCasesKey]: false } }
                      ],
                      minimum_should_match: 1
                    }
                  }
                ]
              }),
              ...((caaCasesPageType === CaaCasesPageType.NewCasesToAccept && !caaCasesFilterValue) && {
                must: [
                  { term: { [newCasesKey]: true } }
                ]
              })
            }
          },
          {
            bool: {
              ...(caaCasesFilterValue && !Array.isArray(caaCasesFilterValue) && {
                must: caseReferenceFilter
              }),
              ...(caaCasesFilterValue && Array.isArray(caaCasesFilterValue) && {
                should: caseReferenceFilter
              })
            }
          }
        ]
      }
    },
    size: pageSize,
    sort: [
      {
        created_date: 'desc'
      }
    ]
  };
}

function mapCcdData(ccdCase: CcdCase, columnConfigs: CcdColumnConfig[], caseType: string): any[] {
  const data = Array<any>();
  ccdCase.cases.forEach((caseData) => data.push(onGeneratedRow(caseData, columnConfigs, caseType)));
  return data;
}

function onGeneratedRow(ccdCaseData: CcdCaseData, columnConfigs: CcdColumnConfig[], caseType: string) {
  const caaCase = {};
  columnConfigs.forEach((columnConfig) => {
    if (typeof ccdCaseData.fields[columnConfig.key] !== 'object') {
      caaCase[columnConfig.key] = ccdCaseData.fields[columnConfig.key];
    } else {
      if (ccdCaseData.fields[columnConfig.key]) {
        caaCase[columnConfig.key] = ccdCaseData.fields[columnConfig.key].OrgPolicyReference;
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
    caseHeader.fields.forEach((header) => {
      if (header) {
        ccdColumnConfigs.push({
          header: header.label,
          key: header.case_field_id,
          type: header.case_field_type.type === 'DateTime' ? 'date' : header.case_field_type.type
        });
      }
    });
  });
  return ccdColumnConfigs;
}
