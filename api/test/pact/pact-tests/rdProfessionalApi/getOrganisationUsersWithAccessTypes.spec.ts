import { expect } from 'chai';
import { OrganisationWithUsers } from '../pactFixtures';
import { getOrganisationDetails } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

import { Matchers } from '@pact-foundation/pact';
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_professionalExternalUsers', port: 8000 });

describe('RD Professional API', () => {
  describe('Get all users for organistion', async () => {
    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'Professional User exists for get Organisation with user access types with identifier HM2OHHS',
        uponReceiving: 'A request for from a logged in user of that organisation',
        withRequest: {
          method: 'GET',
          path: '/refdata/external/v1/organisations/users',
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
          organisationResponse

        }
      };
      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction);
    });

    it('returns the correct response', async () => {
      const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/refdata/external/v1/organisations/users`;

      const resp = getOrganisationDetails(taskUrl);

      resp.then((response) => {
        const responseDto: OrganisationWithUsers = <OrganisationWithUsers> response.data;
        assertResponse(responseDto);
      }).then(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      }).finally(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      });
    });

    function assertResponse(dto: OrganisationWithUsers): void {
      // eslint-disable-next-line no-unused-expressions
      expect(dto).to.be.not.null;
      expect(dto.organisationIdentifier).to.equal('K100');
      expect(dto.organisationStatus).to.equal('ACTIVE');
    }

    const organisationResponse =
      {
        organisationIdentifier: somethingLike('K100'),
        organisationStatus: somethingLike('ACTIVE'),
        organisationProfileIds: [
          somethingLike('SOLICITOR_PROFILE')
        ],
        users: somethingLike([{
          userIdentifier: somethingLike(''),
          firstName: somethingLike('firstName1'),
          lastName: somethingLike('lastName1'),
          email: somethingLike('email1@org.com'),
          idamStatus: somethingLike('ACTIVE'),
          lastUpdated: somethingLike(''),
          roles: null,
          idamStatusCode: somethingLike('200'),
          idamMessage: somethingLike('11 OK'),
          userAccessTypes: [
            {
              jurisdictionId: somethingLike('12345'),
              organisationProfileId: somethingLike('12345'),
              accessTypeId: somethingLike('1234'),
              enabled: somethingLike('true')
            }
          ]
        }])
      };
  });
});
