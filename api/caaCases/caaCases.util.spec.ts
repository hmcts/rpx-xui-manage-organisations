import { expect } from 'chai';
import { caseAssignment } from './caaCases.constants';
import { getApiPath, getRequestBody } from './caaCases.util';
import { CaaCasesPageType } from './enums';

describe('util', () => {
  it('getApiPath', () => {
    const fullPath = getApiPath('http://somePath', 'caseTypeId1');
    expect(fullPath).to.equal(`http://somePath${caseAssignment}?ctid=caseTypeId1&use_case=ORGCASES`);
  });

  it('should generate the request body for retrieving all assigned cases', () => {
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.AssignedCases);
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
      from: 0,
      query: {
        bool: {
          filter: [
            {
              multi_match: {
                fields: [ 'data.*.Organisation.OrganisationID' ],
                query: 'GCXGCY1',
                type: 'phrase'
              }
            },
            {
              bool: {
                must: [
                  {
                    range: {
                      'supplementary_data.orgs_assigned_users.GCXGCY1': {
                        gt: 0
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      size: 10,
      sort: [
        {
          created_date: 'desc'
        }
      ]
    });
  });

  it('should generate the request body for retrieving all unassigned cases', () => {
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.UnassignedCases);
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
      from: 0,
      query: {
        bool: {
          filter: [
            {
              multi_match: {
                fields: [ 'data.*.Organisation.OrganisationID' ],
                query: 'GCXGCY1',
                type: 'phrase'
              }
            },
            {
              bool: {
                must_not: [
                  {
                    range: {
                      'supplementary_data.orgs_assigned_users.GCXGCY1': {
                        gt: 0
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      size: 10,
      sort: [
        {
          created_date: 'desc'
        }
      ]
    });
  });

  it('should generate the request body for retrieving a specific assigned case', () => {
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.AssignedCases, '1111222233334444');
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
      from: 0,
      query: {
        bool: {
          must: [
            {
              match: {
                'reference.keyword': '1111222233334444'
              }
            }
          ],
          filter: [
            {
              multi_match: {
                fields: [ 'data.*.Organisation.OrganisationID' ],
                query: 'GCXGCY1',
                type: 'phrase'
              }
            },
            {
              bool: {
                must: [
                  {
                    range: {
                      'supplementary_data.orgs_assigned_users.GCXGCY1': {
                        gt: 0
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      size: 10,
      sort: [
        {
          created_date: 'desc'
        }
      ]
    });
  });

  it('should generate the request body for retrieving a specific unassigned case', () => {
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.UnassignedCases, '1111222233334444');
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
      from: 0,
      query: {
        bool: {
          must: [
            {
              match: {
                'reference.keyword': '1111222233334444'
              }
            }
          ],
          filter: [
            {
              multi_match: {
                fields: [ 'data.*.Organisation.OrganisationID' ],
                query: 'GCXGCY1',
                type: 'phrase'
              }
            },
            {
              bool: {
                must_not: [
                  {
                    range: {
                      'supplementary_data.orgs_assigned_users.GCXGCY1': {
                        gt: 0
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      size: 10,
      sort: [
        {
          created_date: 'desc'
        }
      ]
    });
  });
});
