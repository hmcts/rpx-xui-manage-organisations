import { Pact } from '@pact-foundation/pact'
import { expect } from 'chai'
import * as path from 'path'
import {request, Request} from 'express'
import {getConfigValue} from '../../../configuration';
import {SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../configuration/references';
import {getOrganisationId} from '../../../services/rdProfessional';
import {postOrganisation} from '../../../services/rdProfessional';

describe("RD Professional API", () => {
  const testUrl = "http://localhost:8992"
  const rdProfessionalPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
  const getOrgnByIdPath = `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/search/organisations/email@email.com)`;

  console.log(`value of the rdProfessionalURL is ......`+getOrgnByIdPath);

  const port = 8992
  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "xui_manage_org_sidam_user_details",
    provider: "referenceData_organisationalExternalPbas",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })

  const EXPECTED_BODY = {
    "organisationId": "123456",
  }

  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  describe("getOrganisationId", () => {

    const jwt = 'some-access-token'
    const details = ''; // ATM this is not being used in the Service.


    before(done => {
      const interaction = {
        state: "Pbas organisational data exists for identifier ",
        uponReceiving: "referenceData_organisationalExternalPbas will respond with:",
        withRequest: {
          method: "GET",
          path: "/search/organisations/henry_fr_harper@yahoo.com",
          // headers: {
          //     Authorization: "Bearer some-access-token"
          // },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: EXPECTED_BODY,
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {
      postOrganisation(details, null).then(response => {
        console.log(response.data)
        expect(response.data).to.eql(EXPECTED_BODY)
        done()
      }, done)
    })
   })

})
