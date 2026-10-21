import { CaaCasesPageType } from '../caaCases/enums';
import { searchCasesString } from './caaCaseTypes.constants';
import { getConfigValue } from '../configuration';
import { UNASSIGNED_CASE_TYPES } from '../configuration/references';
import * as log4jui from '../lib/log4jui';

const logger = log4jui.getLogger('caa-case-types');

export function getRequestBody(organisationID: string, caaCasesPageType: string, caaCasesFilterValue?: string | string[]) {
  const organisationAssignedUsersKey = `supplementary_data.orgs_assigned_users.${organisationID}`;
  const newCasesKey = `supplementary_data.new_case.${organisationID}`;
  const reference = 'reference.keyword';
  const caseReferenceFilter: any[] = [];
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
    _source: false,
    from: 0,
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
                        { term: { [newCasesKey]: false } },
                        { bool: { must_not: { exists: { field: newCasesKey } } } }
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
    size: 100,
    sort: {
      created_date: {
        order: 'desc'
      }
    }
  };
}

export function getApiPath(ccdPath: string, caseTypes: string) {
  return `${ccdPath}${searchCasesString}${caseTypes}`;
}

function setupCaseConfig() {
  const unassignedCaseConfig = getConfigValue(UNASSIGNED_CASE_TYPES);
  const caseConfig = unassignedCaseConfig.split('|').reduce((acc, entry) => {
    const [caseType, newCases, groupAccess] = entry.split(',');
    acc[caseType] = {
      new_cases: newCases === 'true',
      group_access: groupAccess === 'true'
    };
    return acc;
  }, {} as Record<string, { new_cases: boolean; group_access: boolean }>);
  return caseConfig;
}

export function addCaseConfiguration(response) {
  const resData = response.data;
  const unassignedCaseConfig = setupCaseConfig();
  logger.debug('Unassigned case configuration loaded', unassignedCaseConfig);
  resData.case_types_results.forEach((caseTypeResult) => {
    const { case_type_id } = caseTypeResult;
    if (unassignedCaseConfig[case_type_id]) {
      caseTypeResult.caseConfig = unassignedCaseConfig[case_type_id];
    }
  });
}

export function filterCaseData(response, includeCaseData: boolean) {
  if (!Array.isArray(response.data?.cases)) {
    return;
  }

  if (!includeCaseData) {
    delete response.data.cases;
    return;
  }

  response.data.cases = response.data.cases.map((caseData) => ({
    id: caseData.id,
    case_type_id: caseData.case_type_id,
    supplementary_data: caseData.supplementary_data
  }));
}
