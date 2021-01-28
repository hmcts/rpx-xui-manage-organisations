import {Pact} from '@pact-foundation/pact'
import {expect} from 'chai'
import * as getPort from 'get-port';
import * as path from 'path'
import {FeeAccount} from '../../../../../src/fee-accounts/models/pba-accounts';
import {getAccountFeeAndPayApi} from '../pactUtil';

const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;

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
    let mockServerPort: number
    let provider: Pact

    const accountId = 'PBA1234'

    // Setup the provider
    before(async () => {
        mockServerPort = await getPort()
        provider = new Pact({
            consumer: "xui_manageOrg",
            provider: "payment_accounts",
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
            provider.addInteraction(interaction).then(() => {
                done()
            })
        })

        it("returns the correct response", done => {
            // call the pactUtil's method which Calls The Downstream FeeAndPay API directly without going through the Service Class.

            const taskUrl: string = `${provider.mockService.baseUrl}/accounts/` + accountId;

            const resp = getAccountFeeAndPayApi(taskUrl);
            resp.then((response) => {
                console.log(' back in the TEST ....  assertion call.....');
                const responseDto: FeeAccount = <FeeAccount>response.data
                assertResponse(responseDto);
            }).then(done, done)
        })
    })
})

function assertResponse(dto: FeeAccount) {
    expect(dto.account_name).to.equal('account name');
    expect(dto.account_number).to.equal('PBA1234');

}


