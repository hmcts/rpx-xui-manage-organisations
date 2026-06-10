import { expect } from 'chai';
import { EditUserPermissionsDto } from '../pactFixtures';
import { editUserPermissions } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

import { Matchers } from '@pact-foundation/pact';
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_professionalExternalUsers', port: 8000 });

describe('RD Professional API', () => {
  describe('Edit UserPermssions given userId', () => {
    const userId = '123456';

    const mockRequest = {
      'email': 'Joe.bloggs@mailnesia.com',
      'firstName': 'Joe',
      'lastName': 'Bloggs',
      'idamStatus': 'active',
      'rolesAdd': [
        {
          'name': 'superuser'
        }
      ]
    };

    const mockResponse = {
      'roleAdditionResponse': {
        idamMessage: somethingLike('Roles successfully Updated'),
        idamStatusCode: '200'
      }
    };

    const requestPath = '/refdata/external/v1/organisations/users/' + userId;

    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'Professional User exists for identifier ' + userId,
        uponReceiving: 'A request to update that user',
        withRequest: {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer some-access-token',
            'ServiceAuthorization': 'serviceAuthToken'
          },
          path: requestPath,
          body: mockRequest
        },
        willRespondWith: {
          headers: {
            'Content-Type': 'application/json'
          },
          status: 200,
          body: mockResponse
        }
      };
      // @ts-ignore
      await pactSetUp.provider.addInteraction(interaction);
    });

    after(async () => {
      await pactSetUp.provider.finalize();
    });

    it('Returns the correct response', async () => {
      // call the pactUtil's method which Calls The Downstream API directly without going through the Service Class.

      const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/refdata/external/v1/organisations/users/` + userId;
      const response = await editUserPermissions(taskUrl, mockRequest as any);
      const responseDto: EditUserPermissionsDto = <EditUserPermissionsDto>response.data;
      assertResponse(responseDto);
      await pactSetUp.provider.verify();
    });
  });
});

function assertResponse(dto: EditUserPermissionsDto): void {
  expect(dto.roleAdditionResponse.idamMessage).to.be.equal('Roles successfully Updated');
  expect(dto.roleAdditionResponse.idamStatusCode).to.be.equal('200');
}
