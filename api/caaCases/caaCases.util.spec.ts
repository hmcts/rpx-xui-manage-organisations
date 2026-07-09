import { expect } from 'chai';
import { caseAssignment } from './caaCases.constants';
import { getApiPath, getRequestBody } from './caaCases.util';
import { CaaCasesFilterType, CaaCasesPageType } from './enums';

describe('caaCases Util', () => {
  it('should getApiPath', () => {
    const fullPath = getApiPath('http://somePath', 'caseTypeId1');
    expect(fullPath).to.equal(`http://somePath${caseAssignment}?ctid=caseTypeId1&use_case=ORGCASES`);
  });

  it('should generate the request body for retrieving all assigned cases', () => {
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.AssignedCases, CaaCasesFilterType.None);
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
                  },
                  {
                    bool: {
                      should: [
                        {
                          bool: {
                            must_not: {
                              exists: {
                                field: 'supplementary_data.new_case.GCXGCY1'
                              }
                            }
                          }
                        },
                        {
                          term: {
                            'supplementary_data.new_case.GCXGCY1': false
                          }
                        }
                      ],
                      minimum_should_match: 1
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
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.UnassignedCases, CaaCasesFilterType.None);
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
                    bool: {
                      should: [
                        {
                          term: {
                            'supplementary_data.orgs_assigned_users.GCXGCY1': 0
                          }
                        },
                        {
                          bool: {
                            must_not: {
                              exists: {
                                field: 'supplementary_data.orgs_assigned_users.GCXGCY1'
                              }
                            }
                          }
                        }
                      ],
                      minimum_should_match: 1
                    }
                  },
                  {
                    bool: {
                      should: [
                        {
                          bool: {
                            must_not: {
                              exists: {
                                field: 'supplementary_data.new_case.GCXGCY1'
                              }
                            }
                          }
                        },
                        {
                          term: {
                            'supplementary_data.new_case.GCXGCY1': false
                          }
                        }
                      ],
                      minimum_should_match: 1
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
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.AssignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
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
              bool: {}
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
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.UnassignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
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
              bool: {}
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
    const requestBody = getRequestBody('GCXGCY1', 0, 10, CaaCasesPageType.AssignedCases, CaaCasesFilterType.CaseReferenceNumber, ['1111222233334444', '4444333322221111']);
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
              bool: {}
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
});
