import { expect } from 'chai';
import { OrganisationInternalResponse } from '../pactFixtures';
import { getOrganisationDetails } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_organisationalInternal', port: 9292 });

describe('Get Internal Organisation Details from RDProfessionalAPI ', () => {
  describe('Get Internal Organisation Details', async () => {
    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'Active organisations exists for a logged in user using lastUpdatedSince',
        uponReceiving: 'A request for organisation since last updated',
        withRequest: {
          method: 'GET',
          path: '/refdata/internal/v1/organisations',
          query: 'since=2019-08-16T15:00:40',
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
          organisationInternalResponse

        }
      };
      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction);
    });

    it('returns the correct response', async () => {
      const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/refdata/internal/v1/organisations?since=2019-08-16T15:00:40`;

      const resp = getOrganisationDetails(taskUrl);

      resp.then((response) => {
        const responseDto: OrganisationInternalResponse = <OrganisationInternalResponse> response.data;
        assertResponse(responseDto);
      }).then(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      }).finally(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      });
    });

    function assertResponse(dto: OrganisationInternalResponse): void {
      // eslint-disable-next-line no-unused-expressions
      expect(dto).to.be.not.null;
      expect(dto.moreAvailable).to.equal('false');
      expect(dto.organisations[0].lastUpdated).to.be.not.null;
      expect(dto.organisations[0].organisationProfileIds).to.('SOLICITOR_PROFILE');
    }

    const organisationInternalResponse =
      {
        organisations: [
          {
            name: somethingLike('Org-Name'),
            organisationIdentifier: somethingLike('M0AEAP0'),
            status: somethingLike('ACTIVE'),
            sraId: somethingLike('sra-id'),
            sraRegulated: somethingLike(false),
            companyNumber: somethingLike('companyN'),
            companyUrl: somethingLike('www.org.com'),
            contactInformation: [],
            superUser: {
              firstName: somethingLike('some-fname'),
              lastName: somethingLike('some-lname'),
              email: somethingLike('some-email-address')
            },
            lastUpdated: somethingLike('2023-11-20T15:51:33'),
            dateApproved: somethingLike('2023-11-19T15:51:33'),
            organisationProfileIds: [somethingLike('SOLICITOR_PROFILE')]
          }
        ],
        moreAvailable: somethingLike(false)
      };
  });
});
