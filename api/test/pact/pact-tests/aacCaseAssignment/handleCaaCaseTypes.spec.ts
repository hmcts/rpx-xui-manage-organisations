import { expect } from 'chai';
import { MatchersV3 } from '@pact-foundation/pact';
import { CASE_TYPES, UNASSIGNED_CASE_TYPES } from '../../../../configuration/references';
import { consumerRequest } from '../settings/consumer-request';
import { PactV3TestSetup } from '../settings/provider.mock';

const { like: somethingLike } = MatchersV3;
const pactSetUp = new PactV3TestSetup({ provider: 'acc_manageCaseAssignment', port: 8000 });
const caseTypes = 'MoneyClaimCase,DIVORCE,FinancialRemedyContested,FinancialRemedyMVP2,Asylum,Caveat,GrantOfRepresentation,StandingSearch,WillLodgement,CARE_SUPERVISION_EPO,Benefit,NFD';

<<<<<<< Updated upstream
describe('Handle unassigned case types ', () => {
  describe('Handles caa case types', () => {
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
                ...{
                  must: [
                    { range: { 'key': { gt: 0 } } }
                  ]
                },
                ...{
                  must_not: [
                    { range: { 'key': { gt: 0 } } }
                  ]
                }
              }
            },
            {
              bool: {
                ...{
                  must: {}
                },
                ...{
                  should: {}
                }
              }
            }
          ]
        }
=======
describe('Handle unassigned case types', () => {
  let context: ReturnType<typeof consumerRequest>;
  before(async () => {
    pactSetUp.provider.addInteraction({
      states: [{ description: 'Handle caa case types' }],
      uponReceiving: 'A list of case types (from config)',
      withRequest: {
        method: 'POST', path: '/ccd/searchCases', query: { ctid: caseTypes },
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer some-access-token', ServiceAuthorization: 'serviceAuthToken'
        },
        body: somethingLike({
          _source: false, from: 0,
          query: { bool: { filter: [
            { multi_match: { fields: ['data.*.Organisation.OrganisationID'], query: 'organisationId', type: 'phrase' } },
            { bool: { must: [
              { bool: { should: [
                { term: { 'supplementary_data.orgs_assigned_users.organisationId': 0 } },
                { bool: { must_not: { exists: { field: 'supplementary_data.orgs_assigned_users.organisationId' } } } }
              ], minimum_should_match: 1 } },
              { bool: { should: [
                { term: { 'supplementary_data.new_case.organisationId': false } },
                { bool: { must_not: { exists: { field: 'supplementary_data.new_case.organisationId' } } } }
              ], minimum_should_match: 1 } }
            ] } },
            { bool: {} }
          ] } }, size: 100, sort: { created_date: { order: 'desc' } }
        })
>>>>>>> Stashed changes
      },
      willRespondWith: {
        status: 200, headers: { 'Content-Type': 'application/json' },
        body: {
          total: somethingLike(2),
          cases: [{ case_id: somethingLike('case 1') }, { case_id: somethingLike('case_2') }],
          case_types_results: somethingLike([])
        }
      }
    });
  });
  after(async () => {
    context?.restore();
  });
  it('uses the production search handler, request builder and HTTP client', async () => {
    await pactSetUp.provider.executeTest(async (mockServer) => {
      context = consumerRequest(mockServer.url, {
        caaCasesPageType: 'unassigned-cases', caaCasesFilterType: 'none'
      }, { [CASE_TYPES]: caseTypes, [UNASSIGNED_CASE_TYPES]: '' });
      const { handleCaaCaseTypes } = context.load('../../../../caaCaseTypes');
      await handleCaaCaseTypes(context.req, context.res, context.next);
      expect(context.rawResponse).to.be.not.null;
      expect(context.rawResponse.total).to.equal(2);
      expect(context.rawResponse.cases[0].case_id).to.equal('case 1');
      expect(context.rawResponse.case_types_results).to.deep.equal([]);
      expect(context.sent.firstCall.args[0].total).to.equal(2);
      expect(context.sent.firstCall.args[0].case_types_results).to.deep.equal([]);
    });
  });
});
