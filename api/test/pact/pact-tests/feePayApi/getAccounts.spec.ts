import { expect } from 'chai';
import { FeeAccount } from '../../../../../src/fee-accounts/models/pba-accounts';
import { getAccountFeeAndPayApi } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';


const { Matchers } = require('@pact-foundation/pact');
const { somethingLike, like, eachLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'payment_accounts', port: 8000 });


const responsePaymentAccountDto =
{
  account_number: somethingLike("PBA1234"),
  account_name: somethingLike("account name"),
  credit_limit: like(20000.00),
  available_balance: like(20000.00),
  status: somethingLike("Active"),
  effective_date: somethingLike("2021-01-20T12:56:47.576Z")
}

describe("Payment API interaction for get account", () => {
  const accountId = 'PBA1234'

  describe("Get Organisation", () => {

    const jwt = 'some-access-token'
    const details = ''; // ATM this is not being used in the Service.

    before(async () => {
      await pactSetUp.provider.setup()
      const interaction = {
        state: "An account exists with identifier PBA1234",
        uponReceiving: "A request for that account",
        withRequest: {
          method: "GET",
          path: "/accounts/" + accountId,
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
      pactSetUp.provider.addInteraction(interaction)
    })

    it("returns the correct response", async () => {
      // call the pactUtil's method which Calls The Downstream FeeAndPay API directly without going through the Service Class.

      const taskUrl: string = `${pactSetUp.provider.mockService.baseUrl}/accounts/` + accountId;

      const resp = getAccountFeeAndPayApi(taskUrl);
      resp.then((response) => {
        const responseDto: FeeAccount = <FeeAccount>response.data
        assertResponse(responseDto);
      }).then(() => {
        pactSetUp.provider.verify()
        pactSetUp.provider.finalize()
      })
    })
  })
})

function assertResponse(dto: FeeAccount) {
  expect(dto.account_name).to.equal('account name');
  expect(dto.account_number).to.equal('PBA1234');

}
