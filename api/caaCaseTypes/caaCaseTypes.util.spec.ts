import { expect } from 'chai';
import { CaaCasesPageType } from '../caaCases/enums';
import { searchCasesString } from './caaCaseTypes.constants';
import { getApiPath, getRequestBody } from './caaCaseTypes.util';

describe('caaCaseTypes Util', () => {
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
                  { range: { 'supplementary_data.orgs_assigned_users.GCXGCY1': { gt: 0 } } },
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
                          term: {
                            'supplementary_data.new_case.GCXGCY1': false
                          }
                        },
                        {
                          bool: {
                            must_not: {
                              exists: {
                                field: 'supplementary_data.new_case.GCXGCY1'
                              }
                            }
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
      size: 100,
      sort: {
        created_date: {
          order: 'desc'
        }
      }
    });
  });
});
