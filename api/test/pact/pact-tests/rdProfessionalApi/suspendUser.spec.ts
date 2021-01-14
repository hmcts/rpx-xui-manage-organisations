import { Pact } from '@pact-foundation/pact'
import { expect } from 'chai'
import * as path from 'path'
import {SuspendUserReponseDto} from '../pactFixtures.spec'
import {suspendUser} from '../pactUtil';
import * as getPort from 'get-port'
const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;

describe("RD Professional API", () => {
  let mockServerPort: number
  let provider: Pact

  // Setup the provider
  before(async() => {
    mockServerPort = await getPort()
    provider = new Pact({
      consumer: "XUIManageOrg",
      provider: "RdProfessionalApi__",//TODO
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

  describe("Suspend A User", () => {

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
         "idamStatusCode": somethingLike(201)
        }
    }

    const requestPath = "/refdata/external/v1/organisations/users/123456";

    before(done => {
      const interaction = {
        state: "Suspend An existing user in the system",
        uponReceiving: "ReferenceDataAPI  will respond if action was successfull or not",
        withRequest: {
          method: "PUT",
          headers: {
            "Content-Type":  "application/json;charset=utf-8",
            "Authorization":  "Bearer some-access-token",
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
          body:mockResponse
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {
      // call the pactUtil's method which Calls The Downstream API directly without going through the Service Class.
      const userId = '123456';
      const taskUrl: string = `${provider.mockService.baseUrl}/refdata/external/v1/organisations/users/`+userId;

      const resp =  suspendUser(taskUrl,mockRequest as any);

      resp.then((response) => {
        const responseDto: SuspendUserReponseDto  = <SuspendUserReponseDto> response.data
        assertResponse(responseDto);
      }).then(done,done)
    })
  })
})

function assertResponse(dto:SuspendUserReponseDto):void{
  expect(dto.roleAdditionResponse.idamMessage).to.equal('Role successfully Updated');
  expect(dto.roleAdditionResponse.idamStatusCode).to.equal(201);
}
