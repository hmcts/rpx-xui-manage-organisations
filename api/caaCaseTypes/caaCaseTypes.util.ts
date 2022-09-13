import { CaaCasesPageType } from '../caaCases/enums';
import { searchCasesString } from './caaCaseTypes.constants';

export function getRequestBody(organisationID: string, caaCasesPageType: string) {
  const organisationAssignedUsersKey = `supplementary_data.orgs_assigned_users.${organisationID}`;

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
              type: "phrase"
            }
          },
          {
            bool: {
              ...(caaCasesPageType === CaaCasesPageType.AssignedCases && {
                must: [
                  { range: { [organisationAssignedUsersKey]: { gt: 0 } } }
                ]
              }),
              ...(caaCasesPageType === CaaCasesPageType.UnassignedCases && {
                must_not: [
                  { range: { [organisationAssignedUsersKey]: { gt: 0 } } }
                ]
              }),
              should: [
                { bool: { must_not: [ { exists: { field: organisationAssignedUsersKey } }] } },
                { bool: { must_not: [ { exists: { field: "supplementary_data" } }] } }
              ]
            }
          }
        ]
      }
    },
    size: 100,
    sort: {
      created_date: {
        order: 'desc',
      },
    },
  };
}

export function getApiPath(ccdPath: string, caseTypes: string) {
  return `${ccdPath}${searchCasesString}${caseTypes}`;
}
