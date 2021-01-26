import {Pact} from '@pact-foundation/pact'
import {expect} from 'chai'
import * as path from 'path'
import {getUserDetails} from '../../../../services/idam'

const {Matchers} = require('@pact-foundation/pact');
const {somethingLike} = Matchers;

describe("Idam API user details", () => {
    const idamTestUrl = "http://localhost:8992"
    const port = 8992
    const provider = new Pact({
        port: port,
        log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
        dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
        spec: 2,
        consumer: "xui_manageOrg",
        provider: "idamApi_users",
        pactfileWriteMode: "merge",
    })

    const EXPECTED_BODY = {
        "id": somethingLike("abc123"),
        "forename": somethingLike("Joe"),
        "surname": somethingLike("Bloggs"),
        "email": somethingLike("joe.bloggs@hmcts.net"),
        "active": somethingLike(true),
        "roles": somethingLike([
            somethingLike("solicitor"), somethingLike("caseworker")
        ])
    }

    // Setup the provider
    before(() => provider.setup())

    // Write Pact when all tests done
    after(() => provider.finalize())

    // verify with Pact, and reset expectations
    afterEach(() => provider.verify())

    describe("get /details", () => {

        const jwt = 'some-access-token'
        before(done => {
            const interaction = {
                state: "a valid user exists",
                uponReceiving: "a request for that user:",
                withRequest: {
                    method: "GET",
                    path: "/details",
                    headers: {
                        Authorization: "Bearer some-access-token"
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: EXPECTED_BODY,
                },
            }
            // @ts-ignore
            provider.addInteraction(interaction).then(() => {
                done()
            })
        })
        it("returns the correct response", (done) => {
            const response: Promise<any> = getUserDetails(jwt, idamTestUrl);
            response.then((axiosResponse) => {
                console.log(axiosResponse.data)
                //expect(axiosResponse.data).to.eql(EXPECTED_BODY)
            }
            ).then(done, done)
        })
    })
})
