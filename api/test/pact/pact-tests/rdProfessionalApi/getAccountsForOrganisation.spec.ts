import {el} from '@angular/platform-browser/testing/src/browser_util';
import { Pact } from '@pact-foundation/pact'
import axios from 'axios';
import { expect } from 'chai'
import * as getPort from 'get-port';
import * as path from 'path'
import {request, Request} from 'express'
import {getConfigValue} from '../../../../configuration';
import {SERVICES_FEE_AND_PAY_API_PATH } from '../../../../configuration/references'
import {getRefdataUserUrl} from '../../../../refdataUserUrlUtil';
import {getAccountsForOrganisationById} from '../pactUtil';
import {PaymentAccountDto} from '../../../../lib/models/transactions';
const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;


describe("RD Professional API", () => {
  let mockServerPort: number
  let provider: Pact

  // Setup the provider
  before(async() => {
    mockServerPort = await getPort()
    provider = new Pact({
      consumer: "XUIManageOrg",
      provider: "referenceData_organisationalExternalPbas",
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

  describe("Get Accounts for Organisation", () => {
    const orgId = '123456';
    const requestPath = "/organisations/"+orgId+"/pbas";

    before(done => {
      const interaction = {
        state: "Details exists for the Organisation by identifier",
        uponReceiving: "referenceData_organisationalExternalPbas will respond with:",
        withRequest: {
          method: "GET",
          path:requestPath,
          headers: {
            "Content-Type": "application/json",
            "ServiceAuthorization": "ServiceAuthToken",
            "Authorization":  "Bearer some-access-token"
          }
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
      const organisation = '123456';
      const taskUrl: string = `${provider.mockService.baseUrl}/organisations/`+organisation+`/pbas`;
      const resp =  getAccountsForOrganisationById(taskUrl);

      resp.then((response) => {
        const responseDto:PaymentAccountDto[]   = <PaymentAccountDto[]> response.data
        assertResponse(responseDto);
      }).then(done,done)
    })
  })
})

const responsePaymentAccountDto: PaymentAccountDto[] = [
  {
    pbaNumber:	somethingLike('XDDDDDoDDDD'),
    organisationId: somethingLike('B123456'),
    userId:	somethingLike('A123123')
  }
]

function assertResponse(dto:PaymentAccountDto[]){
  for(var element of dto ) {
    expect(element.pbaNumber).to.be.equal('XDDDDDoDDDD');
    expect(element.organisationId).to.be.equal('B123456');
    expect(element.userId).to.be.equal('A123123');
  }
}
