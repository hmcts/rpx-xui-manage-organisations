import { expect } from 'chai'
import { CaaCasesPageType } from '../caaCases/enums'
import { searchCasesString } from './caaCaseTypes.constants'
import { getApiPath, getRequestBody } from './caaCaseTypes.util'

describe('caaCaseTypes Util', () => {
  it('should getApiPath', () => {
    const fullPath = getApiPath('http://somePath', 'case1');
    expect(fullPath).to.equal(`http://somePath${searchCasesString}case1`);
  });

  it('should generate request body for case types related to assigned cases', () => {
    const requestBody = getRequestBody('GCXGCY1', CaaCasesPageType.AssignedCases);
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
      _source: false,
      from: 0,
      query: {
        bool: {
          filter: [
            {
              multi_match: {
                fields: ["data.*.Organisation.OrganisationID"],
                query: 'GCXGCY1',
                type: "phrase"
              }
            },
            {
              bool: {
                must: [
                  { range: { 'supplementary_data.orgs_assigned_users.GCXGCY1': { gt: 0 } } }
                ],
                should: [
                  { bool: { must_not: [ { exists: { field: 'supplementary_data.orgs_assigned_users.GCXGCY1' } }] } },
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
    });
  });

  it('should generate request body for case types related to unassigned cases', () => {
    const requestBody = getRequestBody('GCXGCY1', CaaCasesPageType.UnassignedCases);
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
      _source: false,
      from: 0,
      query: {
        bool: {
          filter: [
            {
              multi_match: {
                fields: ["data.*.Organisation.OrganisationID"],
                query: 'GCXGCY1',
                type: "phrase"
              }
            },
            {
              bool: {
                must_not: [
                  { range: { 'supplementary_data.orgs_assigned_users.GCXGCY1': { gt: 0 } } }
                ],
                should: [
                  { bool: { must_not: [ { exists: { field: 'supplementary_data.orgs_assigned_users.GCXGCY1' } }] } },
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
    });
  });
})
