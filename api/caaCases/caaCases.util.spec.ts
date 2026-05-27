import { expect } from 'chai';
import { caseAssignment, caseId, caseTypeStr } from './caaCases.constants';
import { getApiPath, getRequestBody, mapCcdCases } from './caaCases.util';
import { CaaCasesPageType } from './enums';
import { CcdCase } from './interfaces';

describe('caaCases Util', () => {
  it('should getApiPath', () => {
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
                fields: ['data.*.Organisation.OrganisationID'],
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
            },
            {
              bool: {}
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
                fields: ['data.*.Organisation.OrganisationID'],
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
            },
            {
              bool: {}
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
                  {
                    range: {
                      'supplementary_data.orgs_assigned_users.GCXGCY1': {
                        gt: 0
                      }
                    }
                  }
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
                  {
                    range: {
                      'supplementary_data.orgs_assigned_users.GCXGCY1': {
                        gt: 0
                      }
                    }
                  }
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
      size: 10,
      sort: [
        {
          created_date: 'desc'
        }
      ]
    });
  });

  it('should generate the request body for retrieving specific assigned cases', () => {
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.AssignedCases, ['1111222233334444', '4444333322221111']);
    // Use the "eql" assertion because the test is *not* for strict equality (which is what "equal" asserts)
    expect(requestBody).to.eql({
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
                  {
                    range: {
                      'supplementary_data.orgs_assigned_users.GCXGCY1': {
                        gt: 0
                      }
                    }
                  }
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
      size: 10,
      sort: [
        {
          created_date: 'desc'
        }
      ]
    });
  });

  it('should map CCD headers and case data to Manage Org CAA cases', () => {
    const ccdCase = {
      headers: [
        {
          fields: [
            {
              label: 'Case name',
              case_field_id: 'CaseName',
              case_field_type: { type: 'Text' }
            },
            {
              label: 'Created date',
              case_field_id: 'CreatedDate',
              case_field_type: { type: 'DateTime' }
            },
            {
              label: 'Organisation policy',
              case_field_id: 'OrganisationPolicy',
              case_field_type: { type: 'OrganisationPolicy' }
            }
          ]
        }
      ],
      cases: [
        {
          case_id: '1111222233334444',
          fields: {
            CaseName: 'Smith v Jones',
            CreatedDate: '2026-05-27T10:00:00Z',
            OrganisationPolicy: {
              OrgPolicyReference: 'ORG-POLICY-1'
            }
          }
        }
      ]
    } as unknown as CcdCase;

    const mappedCases = mapCcdCases('Civil', ccdCase);

    expect(mappedCases.idField).to.equal('[CASE_REFERENCE]');
    expect(mappedCases.columnConfigs).to.eql([
      { header: 'Case name', key: 'CaseName', type: 'Text' },
      { header: 'Created date', key: 'CreatedDate', type: 'date' },
      { header: 'Organisation policy', key: 'OrganisationPolicy', type: 'OrganisationPolicy' }
    ]);
    expect(mappedCases.data).to.eql([
      {
        CaseName: 'Smith v Jones',
        CreatedDate: '2026-05-27T10:00:00Z',
        OrganisationPolicy: 'ORG-POLICY-1',
        [caseId]: '1111222233334444',
        [caseTypeStr]: 'Civil'
      }
    ]);
  });

  it('should ignore empty headers and null object values when mapping CCD cases', () => {
    const ccdCase = {
      headers: [
        {
          fields: [
            null,
            {
              label: 'Organisation policy',
              case_field_id: 'OrganisationPolicy',
              case_field_type: { type: 'OrganisationPolicy' }
            }
          ]
        }
      ],
      cases: [
        {
          case_id: '2222333344445555',
          fields: {
            OrganisationPolicy: null
          }
        }
      ]
    } as unknown as CcdCase;

    const mappedCases = mapCcdCases('Family', ccdCase);

    expect(mappedCases.columnConfigs).to.eql([
      { header: 'Organisation policy', key: 'OrganisationPolicy', type: 'OrganisationPolicy' }
    ]);
    expect(mappedCases.data).to.eql([
      {
        [caseId]: '2222333344445555',
        [caseTypeStr]: 'Family'
      }
    ]);
  });
});
