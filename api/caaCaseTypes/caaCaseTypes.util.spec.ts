import { expect } from 'chai';
import { CaaCasesPageType } from '../caaCases/enums';
import { searchCasesString, dummyCaseTypeId } from './caaCaseTypes.constants';
import { getApiPath, getRequestBody, sanitizeCaseTypeId } from './caaCaseTypes.util';

describe('caaCaseTypes Util', () => {
  it('should accept valid case type IDs', () => {
    expect(sanitizeCaseTypeId('12_aBc_')).to.eql('12_aBc_');
    expect(sanitizeCaseTypeId('1')).to.eql('1');
    expect(sanitizeCaseTypeId('21-0')).to.eql('21-0');
    expect(sanitizeCaseTypeId('234-1a2Z3_99')).to.eql('234-1a2Z3_99');
    expect(sanitizeCaseTypeId('000-1Z2a3_99')).to.eql('000-1Z2a3_99');
  });

  it('should replace risky case type IDs with a dummy case type id', () => {
    expect(sanitizeCaseTypeId(null)).to.eql(null);
    expect(sanitizeCaseTypeId('')).to.eql(dummyCaseTypeId);
    expect(sanitizeCaseTypeId(' ')).to.eql(dummyCaseTypeId);
    expect(sanitizeCaseTypeId('(')).to.eql(dummyCaseTypeId);
    expect(sanitizeCaseTypeId(')')).to.eql(dummyCaseTypeId);
    expect(sanitizeCaseTypeId('\'')).to.eql(dummyCaseTypeId);
    expect(sanitizeCaseTypeId('TEST#_CASE_TYPE_ID')).to.eql(dummyCaseTypeId);
    expect(sanitizeCaseTypeId('abc*/(-123_99')).to.eql(dummyCaseTypeId);
    expect(sanitizeCaseTypeId('abc-123)_99')).to.eql(dummyCaseTypeId);
    expect(sanitizeCaseTypeId('*abc-123_99')).to.eql(dummyCaseTypeId);
  });

  it('should getApiPath', () => {
    const fullPath = getApiPath('http://somePath', 'case1');
    expect(fullPath).to.equal(`http://somePath${searchCasesString}case1`);
  });

  it('should generate request body for case types related to all assigned cases', () => {
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
                fields: ['data.*.Organisation.OrganisationID'],
                query: 'GCXGCY1',
                type: 'phrase'
              }
            },
            {
              bool: {
                must: [
                  { range: { 'supplementary_data.orgs_assigned_users.GCXGCY1': { gt: 0 } } }
                ]
              }
            },
            {
              bool: { }
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
    });
  });

  it('should generate request body for case types related to all unassigned cases', () => {
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
                fields: ['data.*.Organisation.OrganisationID'],
                query: 'GCXGCY1',
                type: 'phrase'
              }
            },
            {
              bool: {
                must_not: [
                  { range: { 'supplementary_data.orgs_assigned_users.GCXGCY1': { gt: 0 } } }
                ]
              }
            },
            {
              bool: { }
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
    });
  });

  it('should generate the request body for retrieving a specific assigned case', () => {
    const requestBody = getRequestBody('GCXGCY1', CaaCasesPageType.AssignedCases, '1111222233334444');
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
      _source: false,
      from: 0,
      query: {
        bool: {
          filter: [
            {
              multi_match: {
                fields: ['data.*.Organisation.OrganisationID'],
                query: 'GCXGCY1',
                type: 'phrase'
              }
            },
            {
              bool: {
                must: [
                  { range: { 'supplementary_data.orgs_assigned_users.GCXGCY1': { gt: 0 } } }
                ]
              }
            },
            {
              bool: {
                must: [
                  {
                    match: {
                      'reference.keyword': '1111222233334444'
                    }
                  }
                ]
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
    });
  });

  it('should generate the request body for retrieving a specific unassigned case', () => {
    const requestBody = getRequestBody('GCXGCY1', CaaCasesPageType.UnassignedCases, '1111222233334444');
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
      _source: false,
      from: 0,
      query: {
        bool: {
          filter: [
            {
              multi_match: {
                fields: ['data.*.Organisation.OrganisationID'],
                query: 'GCXGCY1',
                type: 'phrase'
              }
            },
            {
              bool: {
                must_not: [
                  { range: { 'supplementary_data.orgs_assigned_users.GCXGCY1': { gt: 0 } } }
                ]
              }
            },
            {
              bool: {
                must: [
                  {
                    match: {
                      'reference.keyword': '1111222233334444'
                    }
                  }
                ]
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
    });
  });

  it('should generate the request body for retrieving specific assigned cases', () => {
    const requestBody = getRequestBody('GCXGCY1', CaaCasesPageType.AssignedCases, ['1111222233334444', '4444333322221111']);
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
      _source: false,
      from: 0,
      query: {
        bool: {
          filter: [
            {
              multi_match: {
                fields: ['data.*.Organisation.OrganisationID'],
                query: 'GCXGCY1',
                type: 'phrase'
              }
            },
            {
              bool: {
                must: [
                  { range: { 'supplementary_data.orgs_assigned_users.GCXGCY1': { gt: 0 } } }
                ]
              }
            },
            {
              bool: {
                should: [
                  {
                    match: {
                      'reference.keyword': '1111222233334444'
                    }
                  },
                  {
                    match: {
                      'reference.keyword': '4444333322221111'
                    }
                  }
                ]
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
    });
  });
});
