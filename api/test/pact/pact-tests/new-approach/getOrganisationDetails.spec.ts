import { Pact } from '@pact-foundation/pact'
import Axios, { AxiosResponse } from 'axios'
import { AxiosInstance } from 'axios'
import { expect } from 'chai'
import {request, Request, Response,response} from 'express';
import * as path from 'path'
import {getConfigValue} from '../../../../configuration'
import {MICROSERVICE, S2S_SECRET, SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../../configuration/references';
import {PaymentAccountDto} from '../../../../lib/models/transactions';
import {getAccountFeeAndPayApi,getOrganisation} from './pactUtil';
import {organisation} from '../../../pact/pact-tests/pactFixtures.spec';

describe("RD Professional API ", () => {
  const rdProfessionalPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);

  const port = 8992
  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "xui_manage_org_organisation_details",
    provider: "referenceData_organisationalDetails",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })

  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  describe("Get Organisation", () => {

    before(done => {
      const interaction = {
        state: "registerOrganisations",
        uponReceiving: "referenceData_organisationalDetails will respond with Organisation details",
        withRequest: {
          method: "GET",
          path: "/refdata/external/v1/organisations",
          query:"",
          headers: {
            "Content-Type":"application/json"
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

      const resp =  getOrganisation();

      resp.then((response) => {
        const responseDto:organisation[] = <organisation[]> response.data
        assertResponse(responseDto);
      }).then(done,done)

    })

    function assertResponse(dto:organisation[]): void{
      console.log( '..... wiinththin the assert statements .... ')
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
