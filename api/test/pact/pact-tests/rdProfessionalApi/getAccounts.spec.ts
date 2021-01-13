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
import {PaymentAccountDto,Payments } from '../../../../lib/models/transactions';
import {postOrganisation} from '../../../../services/rdProfessional';
import {getAccountFeeAndPayApi} from '../pactUtil';


describe("RD Professional API", () => {
  let mockServerPort: number
  let provider: Pact

  const accountId = '123456'

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

  describe("Get Organisation", () => {

    const jwt = 'some-access-token'
    const details = ''; // ATM this is not being used in the Service.

    before(done => {
      const interaction = {
        state: "Organisational data exists for identifier ",
        uponReceiving: "ReferenceDataApi  will respond with:",
        withRequest: {
          method: "GET",
          path:"/accounts/"+accountId,
          headers: {
            "Content-Type": "application/json",
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
      // call the pactUtil's method which Calls The Downstream FeeAndPay API directly without going through the Service Class.

      const taskUrl: string = `${provider.mockService.baseUrl}/accounts/`+accountId;

      const resp =  getAccountFeeAndPayApi(taskUrl);
      resp.then((response) => {
         console.log(' back in the TEST ....  assertion call.....');
         const responseDto:PaymentAccountDto[]   = <PaymentAccountDto[]> response.data
         assertResponse(responseDto);
      }).then(done,done)
    })
   })
})

function assertResponse(dto:PaymentAccountDto[]){
  for(var element of dto ) {
    expect(element.organisationId).to.be.a('string');
    expect(element.pbaNumber).to.be.a('string');
    expect(element.userId).to.be.a('string')
  }
}

const responsePaymentAccountDto: PaymentAccountDto[] = [
  {
    pbaNumber:	'XDDDDDoDDDD',
    organisationId:	'B123456',
    userId:	'A123123'
  }
]
