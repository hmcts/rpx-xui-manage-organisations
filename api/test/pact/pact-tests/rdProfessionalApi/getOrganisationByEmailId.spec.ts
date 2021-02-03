import { Pact } from '@pact-foundation/pact';
import { expect } from 'chai';
import * as getPort from 'get-port';
import * as path from 'path';
import { getOrganisationByEmail } from '../pactUtil';

/*
  Note : The emailAddress path Variable in the GET call to the downstream API is hardcoded for now ,as it is done
  in the actual Service Class . Once hardcoding is removed in service class , it can be removed from here as well .
 */
describe("RD Professional API", () => {

  let mockServerPort: number
  let provider: Pact

  // Setup the provider
  before(async() => {
    mockServerPort = await getPort()
    provider = new Pact({
      consumer: "XUIManageOrg",
      provider: "RdProfessionalApi__", //TODO
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
        state: "Org data exists for identifier ",
        uponReceiving: "Reference Data API  will respond with:",
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

      const resp =  getOrganisationByEmail(taskUrl);
      resp.then((response) => {
         const resp1    = response.data
         expect(resp1).to.equal("Success");
      }).then(done,done)
    })
   })
})
