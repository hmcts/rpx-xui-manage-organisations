import { Pact } from '@pact-foundation/pact'
import { expect } from 'chai'
import * as path from 'path'
import {request, Request} from 'express'
import {getConfigValue} from '../../../configuration';
import {SERVICES_FEE_AND_PAY_API_PATH } from '../../../configuration/references'
import {getOrganisationId} from '../../../services/rdProfessional';
import {PaymentAccountDto,Payments,Payment } from '../../../lib/models/transactions';
import {postOrganisation} from '../../../services/rdProfessional';
import {getAccount, getPayments} from '../../../services/payment';

describe("get /payments", () => {
  const testUrl = "http://localhost:8992"
  const accountId = '123456'

  const feePayApi = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)
  const feePayApiGetPayments = `${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/pba-accounts/${accountId}/payments)`;

  console.log(`value of the feePayApiURL  is ......`+ feePayApiGetPayments);
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


  const responsePayments: Payments =
    {
      payments:[
        // TODO Payment fields here
      ]
    }

  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  xdescribe("getPayments", () => {

    const jwt = 'some-access-token'
    const details = ''; // ATM this is not being used in the Service.


    before(done => {
      const interaction = {
        state: "Pbas organisational data exists for identifier ",
        uponReceiving: "referenceData_organisationalExternalPbas will respond with:",
        withRequest: {
          method: "GET",
          path: "/pba-accounts/123456/payments",
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
          body: responsePayments,
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {
      getPayments(accountId,  null).then(response => {
        console.log(response)
        expect(response).eq(responsePayments);
        done()
      }, done)
    })
   })

})
