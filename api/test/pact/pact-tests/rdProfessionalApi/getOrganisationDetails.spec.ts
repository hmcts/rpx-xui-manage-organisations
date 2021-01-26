import { Pact } from '@pact-foundation/pact';
import { expect } from 'chai';
import * as getPort from 'get-port';
import * as path from 'path';
import { organisation } from '../pactFixtures';
import { getOrganisationDetails } from '../pactUtil';
const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;

describe("Get Organisation Details from RDProfessionalAPI ", () => {

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
      "idamStatusCode": somethingLike("201")
    }
  }


  describe("Get Organisation Details", () => {

      before(done => {
      const interaction = {
        state: "getOrganisationDetails",
        uponReceiving: "ReferenceDataAPI will respond with Organisation details",
        withRequest: {
          method: "GET",
            path: "/refdata/external/v1/organisations",
          headers: {
            "Content-Type":"application/json",
            "Authorization":  "Bearer some-access-token",
            "ServiceAuthorization": "serviceAuthToken"
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-type":"application/json",
           },
          body: {
            organisationResponse
          },
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {

      const taskUrl: string = `${provider.mockService.baseUrl}/refdata/external/v1/organisations`;

      const resp =  getOrganisationDetails(taskUrl);

      resp.then((response) => {
        const responseDto:organisation[] = <organisation[]> response.data
        assertResponse(responseDto);
      }).then(done,done)

    })

    function assertResponse(dto:organisation[]): void{
      expect(dto).to.be.not.null;
      for(var element of dto ) {
        expect(element.contactInformation.companyNumber).to.equal("A1000");
        expect(element.sraId).to.equal("sraId");
        expect(element.organisationIdentifier).to.equal("K100");
        expect(element.superUser.firstName).to.equal("Joe");
        expect(element.superUser.lastName).to.equal("Bloggs");
      }
    }

    const organisationResponse: organisation[] = [
      {
        companyNumber:somethingLike('Address Line 2'),
        companyUrl: somethingLike('google.com'),
        name: somethingLike('TheOrganisation'),
        organisationIdentifier: somethingLike('K100'),
        sraId: somethingLike('sraId'),
        sraRegulated: somethingLike(true),
        status: somethingLike('success'),
        contactInformation: {
          companyNumber:somethingLike('A1000'),
          companyUrl:somethingLike('www.kcompany.com'),
          name:somethingLike('The Kompany'),
          organisationIdentifier:somethingLike('K565')
        },
        superUser: {
          firstName:somethingLike("Joe"),
          lastName:somethingLike("Bloggs")
        }
      }
    ]
  })
})
