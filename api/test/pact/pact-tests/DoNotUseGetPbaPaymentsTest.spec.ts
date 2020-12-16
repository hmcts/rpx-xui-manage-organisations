import { Pact } from '@pact-foundation/pact'
import { expect } from 'chai'
import { request,Request, response,Response, Router } from 'express'
import * as path from 'path'
import {getConfigValue} from '../../../configuration'
import {MICROSERVICE, S2S_SECRET, SERVICES_FEE_AND_PAY_API_PATH} from '../../../configuration/references';
import { http } from '../../../lib/http'

// TODO IMPORTANT ..... NEED TO export  handleAddressRoute for it to be TESTED /
// import {handleAddressRoute} from '../../../payments'

describe("Fees And Payment API", () => {
  const feesAndPaymentsApi = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH);
  const postOrganisationUrl = `${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/pba-accounts/payments/`

  const port = 8992
  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "xui_manage_org_getPbaPayments",
    provider: "fessAndPayments_processPbaPayments",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })

  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  xdescribe("post Organisation", () => {

    // Call Mock to get s2sToken
    //const s2sToken = await s2sTokenGeneration.generateS2sToken(url)
    before(done => {
      const interaction = {
        state: "processPbaPayments",
        uponReceiving: "fessAndPayments_processPbaPayments will respond with:",
        withRequest: {
          method: "GET",
          path: "/pba-accounts/account/payments/",
          headers: {
            "Serviceauthorization": "Bearer abc123",
            "Content-Type": "application/json;charset=utf-8"
          },
          param: {
            configurationKey: 'abc',
          },
          body: {}
        },
        willRespondWith: {
          status: 200,
          headers: {
            "content-type": "application/json;charset=utf-8",
          },
          body: {
            data:
              "test"
          },
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {

      // stub the call to generate s2sToken
      //sinon.stub(s2sTokenGeneration, 'generateS2sToken').resolves('abc123')
      // handleAddressRoute(request,response).then(response => {
      // handleRegisterOrgRoute(request as Request, {express:Response}).then(response => {
      // console.log('logging response .....' + response)
      // console.log('logging response.data .....' + JSON.stringify(response))
      //expect(response.data).to.eql("test")
      // done()
      // }, done)
      // })
      //})
    })
  })
})
