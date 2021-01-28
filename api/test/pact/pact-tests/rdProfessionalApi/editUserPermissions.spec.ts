import {Pact} from '@pact-foundation/pact'
import {expect} from 'chai'
import * as path from 'path'
import {EditUserPermissionsDto} from '../pactFixtures'
import {editUserPermissions} from '../pactUtil';
import * as getPort from 'get-port'

const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;


describe("RD Professional API", () => {
    let mockServerPort: number
    let provider: Pact

    // Setup the provider
    before(async () => {
        mockServerPort = await getPort()
        provider = new Pact({
            consumer: "xui_manageOrg",
            provider: "referenceData_professionalExternalUsers",
            log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
            dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
            logLevel: 'info',
            port: mockServerPort,
            spec: 2,
            pactfileWriteMode: "merge"
        })
        return provider.setup()
    })


    // Write Pact when all tests done
    after(() => provider.finalize())

    // verify with Pact, and reset expectations
    afterEach(() => provider.verify())

    describe("Edit UserPermssions given userId", () => {

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

        before(done => {
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
            provider.addInteraction(interaction).then(() => {
                done()
            })
        })

        it("Returns the correct response", done => {
            // call the pactUtil's method which Calls The Downstream API directly without going through the Service Class.

            const taskUrl: string = `${provider.mockService.baseUrl}/refdata/external/v1/organisations/users/` + userId;
            const resp = editUserPermissions(taskUrl, mockRequest as any);

            resp.then((response) => {
                const responseDto: EditUserPermissionsDto = <EditUserPermissionsDto>response.data
                assertResponse(responseDto);
            }).then(done, done)
        })
    })
})

function assertResponse(dto: EditUserPermissionsDto): void {
    expect(dto.roleAdditionResponse.idamMessage).to.be.equal('Roles successfully Updated');
    expect(dto.roleAdditionResponse.idamStatusCode).to.be.equal("200");
}
