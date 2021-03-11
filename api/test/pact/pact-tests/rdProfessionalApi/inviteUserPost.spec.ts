import { expect } from 'chai';
import { InviteUserResponse } from '../pactFixtures';
import { inviteUser } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike, like, eachLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_organisationalExternalUsers', port: 8000 });


describe("RD Professional API", () => {

  describe("Invite User", () => {

    const mockRequest = {
      "email": "Joe.bloggs@mailnesia.com",
      "firstName": "Joe",
      "lastName": "Bloggs",
      "roles": ["admin"],
      "resendInvite": true
    }

    const mockResponse = {
      userIdentifier: somethingLike('urlIdentifier')
    }

    const requestPath = "/refdata/external/v1/organisations/users/";

    before(async () => {
      await pactSetUp.provider.setup()
      const interaction = {
        state: "Organisation exists that can invite new users",
        uponReceiving: "A request to invite a new user",
        withRequest: {
          method: "POST",
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
          status: 201,
          body: mockResponse
        },
      }
      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction)
    })

    it("returns the correct response", async () => {
      const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/refdata/external/v1/organisations/users/`;
      const resp = inviteUser(taskUrl, mockRequest as any);
      resp.then((response) => {
        const responseDto: InviteUserResponse = <InviteUserResponse>response.data
        assertResponse(responseDto);
      }).then(() => {
        pactSetUp.provider.verify()
        pactSetUp.provider.finalize()
      })
    })
  })
})

function assertResponse(dto: InviteUserResponse): void {
  expect(dto.userIdentifier).to.be.equal('urlIdentifier');
}
