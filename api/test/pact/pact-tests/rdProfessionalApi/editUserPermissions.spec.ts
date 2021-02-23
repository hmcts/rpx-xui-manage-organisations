import { expect } from 'chai';
import { EditUserPermissionsDto } from '../pactFixtures';
import { editUserPermissions } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_professionalExternalUsers', port: 8000 });



describe("RD Professional API", () => {

    describe("Edit UserPermssions given userId", async () => {

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
                idamMessage: somethingLike("Roles successfully Updated"),
                idamStatusCode: "200"
            }
        }

        const requestPath = "/refdata/external/v1/organisations/users/" + userId;

        before(async () => {
          await pactSetUp.provider.setup()
            const interaction = {
                state: "Professional User exists for identifier " + userId,
                uponReceiving: "A request to update that user",
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

        it("Returns the correct response", async () => {
            // call the pactUtil's method which Calls The Downstream API directly without going through the Service Class.

            const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/refdata/external/v1/organisations/users/` + userId;
            const resp = editUserPermissions(taskUrl, mockRequest as any);

            resp.then((response) => {
                const responseDto: EditUserPermissionsDto = <EditUserPermissionsDto>response.data
                assertResponse(responseDto);
            }).then(() => {
              pactSetUp.provider.verify()
              pactSetUp.provider.finalize()
            })
        })
    })
})

function assertResponse(dto: EditUserPermissionsDto): void {
    expect(dto.roleAdditionResponse.idamMessage).to.be.equal('Roles successfully Updated');
    expect(dto.roleAdditionResponse.idamStatusCode).to.be.equal("200");
}
