import { Pact } from '@pact-foundation/pact'
import Axios, { AxiosResponse } from 'axios'
import { AxiosInstance } from 'axios'
import { expect } from 'chai'
import {request, Request, Response,response} from 'express';
import * as getPort from 'get-port';
import * as path from 'path'
import {getConfigValue} from '../../../configuration'
import {MICROSERVICE, S2S_SECRET, SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../configuration/references';
import {PaymentAccountDto} from '../../../lib/models/transactions';
import {getAccountFeeAndPayApi,getOrganisationDetails} from './pactUtil';
import {organisation} from './pactFixtures.spec';

describe("Get Organisation Details from RDProfessionalAPI ", () => {

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
      "idamMessage": "Role successfully Updated",
      "idamStatusCode": "201"
    }
  }


  describe("Get Organisation", () => {

      before(done => {
      const interaction = {
        state: "registerOrganisations",
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
      console.log(`~~~~~~~~~~~~~  Task URL is ` +  taskUrl );

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
        companyNumber:'Address Line 2',
        companyUrl: 'google.com',
        name: 'TheOrganisation',
        organisationIdentifier: 'K100',
        sraId: 'sraId',
        sraRegulated: true,
        status: 'success',
        contactInformation:{
          companyNumber:'A1000',
          companyUrl:'www.kcompany.com',
          name:'The Kompany',
          organisationIdentifier:'K565'
        },
        superUser: {
          firstName:"Joe",
          lastName:"Bloggs"
        }
      }
    ]
  })
})
