import { CaaCasesPageType } from '../caaCases/enums';
import { searchCasesString, validCaseTypeIdRegex, dummyCaseTypeId } from './caaCaseTypes.constants';
import * as log4jui from '../lib/log4jui';

const logger = log4jui.getLogger('user-types');

export function sanitizeCaseTypeId(caseTypeId: string): string {
  const out = caseTypeId === null ? null : (caseTypeId.match(validCaseTypeIdRegex) === null ? dummyCaseTypeId : caseTypeId);
  if (out !== caseTypeId) {
    logger.warn('Case Type Id with unacceptible characters detected. Will be sanitized with default dummy value replacement.');
  }
  return out;
}

export function getRequestBody(organisationID: string, caaCasesPageType: string, caaCasesFilterValue?: string | string[]) {
  const organisationAssignedUsersKey = `supplementary_data.orgs_assigned_users.${organisationID}`;
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
              ...(caaCasesPageType === CaaCasesPageType.AssignedCases && {
                must: [
                  { range: { [organisationAssignedUsersKey]: { gt: 0 } } }
                ]
              }),
              ...(caaCasesPageType === CaaCasesPageType.UnassignedCases && {
                must_not: [
                  { range: { [organisationAssignedUsersKey]: { gt: 0 } } }
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
