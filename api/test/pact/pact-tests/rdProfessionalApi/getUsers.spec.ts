import { expect } from 'chai';
import { UserResponse } from '../pactFixtures';
import { getUsers } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

import { Matchers } from '@pact-foundation/pact';
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_professionalExternalUsers', port: 8000 });

describe('RD Professional API', () => {
  describe('Get Users', () => {
    const mockResponse = {
      organisationIdentifier: somethingLike('GCXGCY1'),
      users: [
        {
          userIdentifier: somethingLike('71ac6370-8b69-4dfa-b150-80d43407ae13'),
          firstName: somethingLike('ProbatePPThree'),
          lastName: somethingLike('Org2'),
          email: somethingLike('probate.pp2.org2@mailinator.com'),
          idamStatus: somethingLike('ACTIVE')
        }
      ]
    };

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'Get the list of users',
        uponReceiving: 'A request to return the user list',
        withRequest: {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer some-access-token',
            'ServiceAuthorization': 'serviceAuthToken'
          },
          path: '/refdata/external/v1/organisations/users',
          query: 'returnRoles=true&status=active'
        },
        willRespondWith: {
          headers: {
            'Content-Type': 'application/json'
          },
          status: 201,
          body: mockResponse
        }
      };
      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction);
    });

    it('returns the correct response', async () => {
      const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/refdata/external/v1/organisations/users?returnRoles=true&status=active`;
      const resp = getUsers(taskUrl);
      resp.then((response) => {
        const responseDto: UserResponse = <UserResponse>response.data;
        assertResponse(responseDto);
      }).then(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      }).finally(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      });
    });
  });
});

function assertResponse(dto: UserResponse): void {
  expect(dto.organisationIdentifier).to.be.equal('GCXGCY1');
  expect(dto.users[0].userIdentifier).to.be.equal('71ac6370-8b69-4dfa-b150-80d43407ae13');
  expect(dto.users[0].firstName).to.be.equal('ProbatePPThree');
  expect(dto.users[0].lastName).to.be.equal('Org2');
  expect(dto.users[0].email).to.be.equal('probate.pp2.org2@mailinator.com');
  expect(dto.users[0].idamStatus).to.be.equal('ACTIVE');
}
