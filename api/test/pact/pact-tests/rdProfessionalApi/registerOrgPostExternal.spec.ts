import { expect } from 'chai';
import { OrganisationCreatedResponse } from '../pactFixtures';
import { registerOrganisationExternalV1 } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'referenceData_organisationalExternalUsers', port: 8000 });


describe("Register External Organisation", () => {

  describe("Register External Organisation", async () => {

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
        "PBA1234567"
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
      organisationIdentifier: somethingLike("A1000200")
    }

    const requestPath = "/refdata/external/v1/organisations";

    before(async () => {
      await pactSetUp.provider.setup()
      const interaction = {
        state: "a request to register an organisation",
        uponReceiving: "A Request to Register External Organisation with the system",
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
     pactSetUp.provider.addInteraction(interaction)
    })

    it("Returns the correct response", async() => {

      const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/refdata/external/v1/organisations`;
      const resp =  registerOrganisationExternalV1(taskUrl,mockRequest as any);

      resp.then((response) => {
        expect(response.status).to.equal(201);
        const responseDto: OrganisationCreatedResponse  = <OrganisationCreatedResponse> response.data
        assertResponse(responseDto);
      }).then(() => {
        pactSetUp.provider.verify()
        pactSetUp.provider.finalize()
      })
    })
  })
})

function assertResponse(response:OrganisationCreatedResponse):void{
  expect(response.organisationIdentifier).to.be.a('string');
}
