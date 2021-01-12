import { Pact } from '@pact-foundation/pact'
import axios from 'axios';
import { expect } from 'chai'
import * as getPort from 'get-port';
import * as path from 'path'
import {request, Request} from 'express'
import {getConfigValue} from '../../../configuration';
import {SERVICES_FEE_AND_PAY_API_PATH } from '../../../configuration/references'
import {getRefdataUserUrl} from '../../../refdataUserUrlUtil';
import {OrganisationCreatedResponse} from './pactFixtures.spec'
import {registerOrganisationExternalV1} from './pactUtil';

describe("Register External Organisation", () => {
  let mockServerPort: number
  let provider: Pact

  // Setup the provider
  before(async() => {
    mockServerPort = await getPort()
    provider = new Pact({
      consumer: "XUIManageOrg",
      provider: "RdProfessionalApi",
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

  describe("Invite User", () => {

    const mockRequest = {
      "name": "Joe Blogg",
      "status": "ACTIVE",
      "sraId": "SRA100",
      "sraRegulated": "REGULATED",
      "companyNumber": "465555",
      "companyUrl": "www.theKCompany.com",
      "superUser": {
        "firstName": "super",
        "lastName": "user",
        "email": "super.user@mailnesia.coms"
      },
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
          "postCode": "NR24TE",
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
      organisationIdentifier: "A1000200"
    }

    const requestPath = "/refdata/external/v1/organisations";

    before(done => {
      const interaction = {
        state: "Register Organisation",
        uponReceiving: "A Request to Register Organisation with the system",
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

    it("Returns the correct response", done => {

      const taskUrl: string = `${provider.mockService.baseUrl}/refdata/external/v1/organisations`;
      console.log(` ~~~~~~~~~~~~~  Task URL is ` +  taskUrl );

      const resp =  registerOrganisationExternalV1(taskUrl,mockRequest as any);

      resp.then((response) => {
        const responseDto: OrganisationCreatedResponse  = <OrganisationCreatedResponse> response.data
        assertResponse(responseDto);
      }).then(done,done)
    })
  })
})

function assertResponse(response:OrganisationCreatedResponse):void{
  expect(response.organisationIdentifier).equals("A1000200");
}
