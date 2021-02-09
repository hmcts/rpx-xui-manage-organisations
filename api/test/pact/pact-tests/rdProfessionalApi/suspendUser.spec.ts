import { expect } from 'chai';
import { SuspendUserReponseDto } from '../pactFixtures';
import { suspendUser } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike, like, eachLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_professionalExternalUsers', port: 8000 });


describe("RD Professional API", () => {

  describe("Suspend A User", async () => {

    const userId = '123456';

    const mockRequest = {
      "email": "Joe.bloggs@mailnesia.com",
      "firstName": "Joe",
      "lastName": "Bloggs",
      "idamStatus": "active",
      "rolesAdd": [
        {
          "name": "superuser"
        }
      ]
    }

    const mockResponse = {
      "roleAdditionResponse": {
        "idamMessage": somethingLike("Role successfully Updated"),
        "idamStatusCode": somethingLike("200")
      }
    }

    const requestPath = "/refdata/external/v1/organisations/users/123456";

    before(async () => {
      const jwt = 'some-access-token'
      await pactSetUp.provider.setup()
      const interaction = {
        state: "Professional User exists for modification with identifier 123456",
        uponReceiving: "a request to update the roles of that user",
        withRequest: {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer some-access-token",
            "ServiceAuthorization": "serviceAuthToken"
          },
          path: requestPath,
          body: mockRequest,
        },
        willRespondWith: {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
          body: mockResponse
        },
      }
      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction)
    })

    it("returns the correct response", async () => {
      // call the pactUtil's method which Calls The Downstream API directly without going through the Service Class.
      const userId = '123456';
      const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/refdata/external/v1/organisations/users/` + userId;

      const resp = suspendUser(taskUrl, mockRequest as any);

      resp.then((response) => {
        const responseDto: SuspendUserReponseDto = <SuspendUserReponseDto>response.data
        assertResponse(responseDto);
      }).then(() => {
        pactSetUp.provider.verify()
        pactSetUp.provider.finalize()
      })
    })
  })
})

function assertResponse(dto: SuspendUserReponseDto): void {
  expect(dto.roleAdditionResponse.idamMessage).to.equal('Role successfully Updated');
  expect(dto.roleAdditionResponse.idamStatusCode).to.equal("200");
}
