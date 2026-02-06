import { expect } from 'chai';
import { Organisation } from '../pactFixtures';
import { getOrganisationDetails } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike, eachLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_organisationalExternalUsers', port: 8000 });

describe('Get Organisation Details from RDProfessionalAPI ', () => {
  describe('Get Organisation Details', async () => {
    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'Organisation with Id exists',
        uponReceiving: 'A request for from a logged in user of that organisation',
        withRequest: {
          method: 'GET',
          path: '/refdata/external/v1/organisations',
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
      const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/refdata/external/v1/organisations`;

      const resp = getOrganisationDetails(taskUrl);

      resp.then((response) => {
        const responseDto: Organisation = <Organisation>response.data;
        assertResponse(responseDto);
      }).then(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      }).finally(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      });
    });

    function assertResponse(dto: Organisation): void {
      expect(dto).to.be.not.null;
      for (const element of dto.contactInformation) {
        expect(element.addressLine1).to.equal('addressLine1');
      }
      expect(dto.sraId).to.equal('sraId');
      expect(dto.organisationIdentifier).to.equal('K100');
      expect(dto.superUser.firstName).to.equal('Joe');
      expect(dto.superUser.lastName).to.equal('Bloggs');
    }

    const organisationResponse =
    {
      companyNumber: somethingLike('Address Line 2'),
      companyUrl: somethingLike('google.com'),
      name: somethingLike('TheOrganisation'),
      organisationIdentifier: somethingLike('K100'),
      sraId: somethingLike('sraId'),
      sraRegulated: somethingLike(true),
      status: somethingLike('success'),
      contactInformation: eachLike({
        addressLine1: 'addressLine1',
        addressLine2: 'addressLine2',
        country: 'country',
        postCode: 'Ha5 1BJ'
      }),
      superUser: {
        firstName: somethingLike('Joe'),
        lastName: somethingLike('Bloggs')
      }
    };
  });
});
