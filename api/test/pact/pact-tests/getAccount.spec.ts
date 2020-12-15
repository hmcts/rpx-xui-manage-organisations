import { Pact } from '@pact-foundation/pact'
import { expect } from 'chai'
import * as path from 'path'
import {request, Request} from 'express'
import {getConfigValue} from '../../../configuration';
import {SERVICES_FEE_AND_PAY_API_PATH } from '../../../configuration/references'
import {getOrganisationId} from '../../../services/rdProfessional';
import {PaymentAccountDto,Payments } from '../../../lib/models/transactions';
import {postOrganisation} from '../../../services/rdProfessional';
import {getAccount} from '../../../services/payment';

describe("RD Professional API", () => {
  // const testUrl = "http://localhost:8992"
  // const feePayApi = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)
  // const feePayApiPath = `${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/account/132456)`;
  //
  // console.log(`value of the rdProfessionalURL is ......`+ feePayApiPath);

  const port = 8992

  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "getAccounts",
    provider: "fee_And_Payments_API",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })

  const accountId = '123456'

  const responsePaymentAccountDto: PaymentAccountDto[] = [
    {
      pbaNumber:	'XDDDDDoDDDD',
      organisationId:	'B123456',
      userId:	'A123123'
    }
  ]
  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  describe("getAccount", () => {

    const jwt = 'some-access-token'
    const details = ''; // ATM this is not being used in the Service.


    before(done => {
      const interaction = {
        state: "Pbas organisational data exists for identifier ",
        uponReceiving: "referenceData_organisationalExternalPbas will respond with:",
        withRequest: {
          method: "GET",
          path: "/accounts/accountId}",
          // headers: {
          //     Authorization: "Bearer some-access-token"
          // },
          body: null // TODO ???
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
      getAccount(accountId,  null).then(response => {
        console.log(response)
        expect(response).eq(responsePaymentAccountDto);
        done()
      }, done)
    })
   })

})
