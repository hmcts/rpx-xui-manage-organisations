import {el} from '@angular/platform-browser/testing/src/browser_util';
import { Pact } from '@pact-foundation/pact'
import axios from 'axios';
import { expect } from 'chai'
import * as getPort from 'get-port';
import * as path from 'path'
import {request, Request} from 'express'
import {getConfigValue} from '../../../../api/configuration';
import {SERVICES_FEE_AND_PAY_API_PATH } from '../../../../api/configuration/references'
import {getRefdataUserUrl} from '../../../../api/refdataUserUrlUtil';
import {getOrganisationId} from '../../../../api/services/rdProfessional';
import {postOrganisation} from '../../../../api/services/rdProfessional';
import {getOrganisationByEmail} from '../../pact/pact-tests/pactUtil';

describe("RD Professional API", () => {

  let mockServerPort: number
  let provider: Pact

  // Setup the provider
  before(async() => {
    mockServerPort = await getPort()
    provider = new Pact({
      consumer: "XUIManageOrg",
      provider: "FeesAndPaymentsApi",
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

  describe("Get Organisaiton By Email", () => {

    const jwt = 'some-access-token'

    before(done => {
      const interaction = {
        state: "Pbas organisational data exists for identifier ",
        uponReceiving: "referenceData_organisationalExternalPbas will respond with:",
        withRequest: {
          method: "GET",
          path:"/search/organisations/henry_fr_harper@yahoo.com",
          headers: {
            "Content-Type": "application/json",
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
         body: "Success"
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {
      const emailAddress='henry_fr_harper@yahoo.com';
      const taskUrl: string = `${provider.mockService.baseUrl}/search/organisations/`+emailAddress;

      console.log(` ~~~~~~~~~~~~~  Task URL is ` +  taskUrl );
      const resp =  getOrganisationByEmail(taskUrl);
      resp.then((response) => {
         const resp1    = response.data
         expect(resp1).to.equal("Success");
      }).then(done,done)
    })
   })
})
