import {el} from '@angular/platform-browser/testing/src/browser_util';
import { Pact } from '@pact-foundation/pact'
import axios from 'axios';
import { expect } from 'chai'
import * as path from 'path'
import {request, Request} from 'express'
import {getConfigValue} from '../../../../configuration';
import {SERVICES_FEE_AND_PAY_API_PATH } from '../../../../configuration/references'
import {getRefdataUserUrl} from '../../../../refdataUserUrlUtil';
import {getOrganisationId} from '../../../../services/rdProfessional';
import {PaymentAccountDto,Payments } from '../../../../lib/models/transactions';
import {postOrganisation} from '../../../../services/rdProfessional';
import {getAccountFeeAndPayApi,getOrganisationByEmail} from '../../pact-tests/new-approach/pactUtil';


describe("RD Professional API", () => {
  const port = 8993
  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "getAccounts",
    provider: "fee_And_Payments_API",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })

  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  describe("Get Organisaiton By Email", () => {

    const jwt = 'some-access-token'
    const details = ''; // ATM this is not being used in the Service.

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
      // call the pactUtil's method which Calls The Downstream FeeAndPay API directly without going through the Service Class.

      const emailAddress='henry_fr_harper@yahoo.com';
      const resp =  getOrganisationByEmail(emailAddress);
      resp.then((response) => {
         console.log(' back in the TEST ....  ASSERTION TO BE DONE.....');
         const resp1    = response.data
         expect(resp1).to.equal("Success");
         //assertResponse(responseDto);
      }).then(done,done)
    })
   })
})



function assertResponse(dto:PaymentAccountDto[]){
  for(var element of dto ) {
    expect(element.organisationId).to.equal("B123456");
    expect(element.pbaNumber).to.equal("XDDDDDoDDDD");
    expect(element.userId).to.equal("A123123");
  }
}
