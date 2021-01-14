import { Pact } from '@pact-foundation/pact'
import { expect } from 'chai'
import * as getPort from 'get-port';
import * as path from 'path'
import {OrganisationCreatedResponse} from '../pactFixtures.spec'
import {inviteUser, registerOrganisation} from '../pactUtil';
const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;

describe("Register Organisation", () => {

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

  describe("Register Organisation", () => {

    const mockRequest = {
      "name": "Joe Blogg",
      "status": "ACTIVE",
      "sraId": "SRA100",
      "sraRegulated": "REGULATEDstring",
      "paymentAccount": [
        "PBAPAYMENTS"
      ],
      "contactInformation": [
        {
          "addressLine1": "27 Heigham Street",
          "addressLine2": "Norwich",
          "addressLine3": "Norfolk",
          "townCity": "Norwich",
          "county": "Norfolk",
          "country": "UK",
          "postCode": "NR245E",
          "dxAddress": [
            {
              "dxNumber": "DX1008",
              "dxExchange": "EXCHANGE"
            }
          ]
        }
      ]
    }

    const mockResponse = {
      organisationIdentifier: somethingLike("A1000200")
    }

    const requestPath = "/refdata/external/v1/organisations/users/";

    before(done => {
      const interaction = {
        state: "Register Organisation",
        uponReceiving: "A Request to register the Organisation ",
        withRequest: {
          method: "POST",
          headers: {
            "Content-Type":  "application/json;charset=utf-8",
            "ServiceAuthorization": "ServiceAuthToken"
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
      const taskUrl: string = `${provider.mockService.baseUrl}/refdata/external/v1/organisations/users/`
      const resp =  registerOrganisation(taskUrl , mockRequest as any);

      resp.then((response) => {
        const responseDto: OrganisationCreatedResponse  = <OrganisationCreatedResponse> response.data
        assertResponse(responseDto);
      }).then(done,done)
    })
  })
})

function assertResponse(response:OrganisationCreatedResponse):void{
  expect(response.organisationIdentifier).to.equal('A1000200');
}
