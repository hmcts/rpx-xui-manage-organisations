import { expect } from 'chai';
import { handleCaaCaseTypes } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'acc_manageCaseAssignment', port: 8000 });

describe('Handle unassigned case types ', () => {
  describe('Handles caa case types', async () => {
    // have kept similar structure to payload in function that calls API but may be discrepancies in understanding
    const mockPayload = {
      _source: false,
      from: 0,
      query: {
        bool: {
          filter: [
            {
              multi_match: {
                fields: ['data.*.Organisation.OrganisationID'],
                query: 'organisationId',
                type: 'phrase'
              }
            },
            {
              bool: {
                ...(true && {
                  must: [
                    { range: { 'key': { gt: 0 } } }
                  ]
                }),
                ...(true && {
                  must_not: [
                    { range: { 'key': { gt: 0 } } }
                  ]
                })
              }
            },
            {
              bool: {
                ...(true && {
                  must: {}
                }),
                ...(true && {
                  should: {}
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

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'Handle caa case types',
        uponReceiving: 'A list of case types (from config)',
        withRequest: {
          method: 'POST',
          path: '/ccd/searchCases',
          query: {
            ctid: 'MoneyClaimCase,DIVORCE,FinancialRemedyContested,FinancialRemedyMVP2,Asylum,Caveat,GrantOfRepresentation,StandingSearch,WillLodgement,CARE_SUPERVISION_EPO,Benefit,NFD'
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer some-access-token',
            'ServiceAuthorization': 'serviceAuthToken'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-type': 'application/json'
          },
          body:
            caseResponse

        }
      };
      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction);
    });

    it('returns the correct response', async () => {
      const caseUrl: string = `${pactSetUp.provider.mockService.baseUrl}/ccd/searchCases?ctid=MoneyClaimCase,DIVORCE,FinancialRemedyContested,FinancialRemedyMVP2,Asylum,Caveat,GrantOfRepresentation,StandingSearch,WillLodgement,CARE_SUPERVISION_EPO,Benefit,NFD`;

      const resp = handleCaaCaseTypes(caseUrl, mockPayload);

      resp.then((response) => {
        const responseDto: any[] = <any>response.data;
        assertResponse(responseDto);
      }).then(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      }).finally(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      });
    });

    function assertResponse(dto: any): void {
      // eslint-disable-next-line no-unused-expressions
      expect(dto).to.be.not.null;
      expect(dto.total).to.equal(2);
      expect(dto.cases[0].case_id).to.equal('case 1');
      expect(dto[0].case_types_results).to.equal([]);
    }

    const caseResponse = {
      total: somethingLike(2),
      cases: [{ case_id: somethingLike('case 1') }, { case_id: somethingLike('case_2') }],
      case_types_results: []
    };
  });
});
