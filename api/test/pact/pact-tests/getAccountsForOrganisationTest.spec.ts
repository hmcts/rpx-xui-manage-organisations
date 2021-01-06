import { Pact } from '@pact-foundation/pact'
import { expect } from 'chai'
import * as path from 'path'
import {getConfigValue} from '../../../configuration'
import {SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../configuration/references'
import {getOrganisationId} from '../../../services/rdProfessional'
//import {getOrganisationIdAxios} from '../../../services/rdProfessional';
import { PaymentAccountDto } from '../../../lib/models/transactions'
import {request, Request} from 'express'
import { http } from '../../../lib/http'


xdescribe("RD Professional API", () => {
  //const testUrl = "http://localhost:8992"
  // const rdProfessionalPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
  // const orgId = 'B123456';
  //
  // const getAccountsForOrgnUrl = `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/organisations/orgId/pbas)`
  //
  // console.log(`~~~~~~~~~~~~~~~~~~~~`  + getAccountsForOrgnUrl)


  const port = 8992;
  // const feeAndPayApiUrl = config.default.pactFeeAndPayApi;
  // const rdProfessionalApiUrl  = config.default.pactRdProfessionalApi;

  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "xui_manage_org_accounts_for_organisation",
    provider: "referenceData_organisationalExternalPbas",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })


  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  describe("getAccountsForOrganisation", () => {

    // console.log( " ~~~~~~~ pactFeeAndPayApi " + feeAndPayApiUrl);
    // console.log( " ~~~~~~~~pactRdProfessionalApiUrl " + rdProfessionalApiUrl);

    const jwt = 'some-access-token'
    const details = ''; // ATM this is not being used in the Service.

    before(done => {
      const interaction = {
        state: "request for Accounts For Organisation",
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
          body: responsePaymentAccountDto,
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {

      const fakeHttp = http({
        session: {
          auth: {
            token: jwt,
          },
        },
      } as unknown as Request)

      //axiosInstance.
      //const xx = http(request);

      getOrganisationId(details, {http:fakeHttp} ).then(response => {
        console.log(response.data)
         expect(response.data).to.eql(responsePaymentAccountDto)
        // TODO Other Asserts here.
        done()
      }, done)
    })
   })

  const responsePaymentAccountDto: PaymentAccountDto[] = [
    {
      pbaNumber:	'XDDDDDoDDDD',
      organisationId:	'B123456',
      userId:	'A123123'
    }
  ]

  const respBody: Object =
    {
      data:	'XDDDDDoDDDD'
    }

})
