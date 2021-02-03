import {Pact} from '@pact-foundation/pact'
import {expect} from 'chai'
import * as getPort from 'get-port';
import * as path from 'path'
import {getOrganisationDetails} from '../pactUtil';
import {organisation} from '../pactFixtures';

const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;

describe("Get Organisation Details from RDProfessionalAPI ", () => {

    let mockServerPort: number
    let provider: Pact

    // Setup the provider
    before(async () => {
        mockServerPort = await getPort()
        provider = new Pact({
            consumer: "xui_manageOrg",
            provider: "referenceData_organisationalExternalUsers",
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

    describe("Get Organisation Details", () => {

        before(done => {
            const interaction = {
                state: "Organisation with Id exists",
                uponReceiving: "A request for from a logged in user of that organisation",
                withRequest: {
                    method: "GET",
                    path: "/refdata/external/v1/organisations",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer some-access-token",
                        "ServiceAuthorization": "serviceAuthToken"
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-type": "application/json",
                    },
                    body:
                    organisationResponse
                    ,
                },
            }
            // @ts-ignore
            provider.addInteraction(interaction).then(() => {
                done()
            })
        })

        it("returns the correct response", done => {

            const taskUrl: string = `${provider.mockService.baseUrl}/refdata/external/v1/organisations`;

            const resp = getOrganisationDetails(taskUrl);

            resp.then((response) => {
                const responseDto: organisation = <organisation>response.data
                assertResponse(responseDto);
            }).then(done, done)

        })

        function assertResponse(dto: organisation): void {
            expect(dto).to.be.not.null;
            for (var element of dto.contactInformation) {
                expect(element.addressLine1).to.equal("addressLine1");
            }
            expect(dto.sraId).to.equal("sraId");
            expect(dto.organisationIdentifier).to.equal("K100");
            expect(dto.superUser.firstName).to.equal("Joe");
            expect(dto.superUser.lastName).to.equal("Bloggs");

        }

        const organisationResponse =
            {
                companyNumber: somethingLike('Address Line 2'),
                companyUrl: somethingLike('google.com'),
                name: somethingLike('TheOrganisation'),
                organisationIdentifier: somethingLike('K100'),
                sraId: somethingLike('sraId'),
                sraRegulated: somethingLike(true),
                status: somethingLike('success'),
                contactInformation: eachLike({
                    addressLine1: 'addressLine1',
                    addressLine2: 'addressLine2',
                    country: 'country',
                    postCode: 'Ha5 1BJ'
                }),
                superUser: {
                    firstName: somethingLike("Joe"),
                    lastName: somethingLike("Bloggs")
                }
            }
    })
})
