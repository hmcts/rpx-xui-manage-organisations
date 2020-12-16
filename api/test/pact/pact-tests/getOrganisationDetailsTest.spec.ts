import { Pact } from '@pact-foundation/pact'
import Axios, { AxiosResponse } from 'axios'
import { AxiosInstance } from 'axios'
import { expect } from 'chai'
import {request, Request, Response,response} from 'express';
import * as path from 'path'
import { http } from '../../../lib/http'
import {getConfigValue} from '../../../configuration'
import {MICROSERVICE, S2S_SECRET, SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../configuration/references';
import {getOrganisationDetails} from '../../../organisation/index'
import {handleOrganisationRoute} from '../../../organisation/index'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import {getOrganisationId} from '../../../services/rdProfessional';
import any = jasmine.any;

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

  describe("post Organisation", () => {

    before(done => {
      const interaction = {
        state: "registerOrganisations",
        uponReceiving: "referenceData_organisationalDetails will respond with:",
        withRequest: {
          method: "GET",
          path: "/refdata/external/v1/organisations",
          query:"",
          headers: {
          //     "Serviceauthorization": "Bearer abc123" ,
                  "Content-Type":"application/json"
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
             "Content-type":"application/json",
           },
          body: {
            data:"test123"
          },
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {

      const httpRequest = http({} as unknown as Request)

      getOrganisationDetails( {http:httpRequest} , rdProfessionalPath).then(response  => {
        done()
        expect(response.data).to.deep.eq("test")
      }, done)
    })
   })
})
