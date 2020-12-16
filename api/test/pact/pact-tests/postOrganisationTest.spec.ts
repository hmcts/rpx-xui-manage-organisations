import { Pact } from '@pact-foundation/pact'
import { expect } from 'chai'
import {request, Request, Response,response} from 'express';
import * as path from 'path'
import * as sinon from 'sinon';
import {emailAddress} from '../../../../src/register/constants/emailAddress';
import {getConfigValue} from '../../../configuration'
import {MICROSERVICE, S2S_SECRET, SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../configuration/references';
import {PaymentAccountDto } from '../../../lib/models/transactions'
import { http } from '../../../lib/http'
import * as s2sTokenGeneration from '../../../lib/s2sTokenGeneration';
import {generateOneTimePassword} from '../../../lib/s2sTokenGeneration';
import {handleRegisterOrgRoute} from '../../../register-org';


describe("RD Professional API", () => {
  const rdProfessionalPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
  const postOrganisationUrl = `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations)`

  const port = 8993
  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "xui_manage_org_register_organisation",
    provider: "referenceData_registerOrganisation",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })

  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  xdescribe("post Organisation", () => {

    // Call Mock to get s2sToken
    //const s2sToken = await s2sTokenGeneration.generateS2sToken(url)
    before(done => {
      const interaction = {
        state: "registerOrganisations",
        uponReceiving: "referenceData_registerOrganisation will respond with:",
        withRequest: {
          method: "POST",
          path: "/refdata/internal/v1/organisations",
          headers: {
              "Serviceauthorization": "Bearer abc123" ,
              "Content-Type":"application/json;charset=utf-8"
          },
          body: {
          "contactInformation": [
           {
                      "addressLine1": "officeAddress_1",
                      "addressLine2": "officeAddress_2",
                      "postCode": "NR24TE",
                      "county":"SURREY",
                      "townCity":"London"
            }
          ],
          "name":"name",
          "superUser": {
              "email": "email@mailnator.com",
                "firstName": "Joe",
                "jurisdictions": "UK",
                "lastName": "Bloggs"
            },
          "paymentAccount":[]
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
             "content-type":"application/json;charset=utf-8",
           },
          body: {
            data:"test"
          },
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {

      // stub the call to generate s2sToken
      sinon.stub(s2sTokenGeneration, 'generateS2sToken').resolves('abc123')

      request.body =  {
        fromValues: {
          officeAddressOne:'officeAddress_1',
          officeAddressTwo:'officeAddress_2',
          postcode: "NR24TE",
          county:"SURREY",
          townOrCity:"London",
          emailAddress:'email@mailnator.com',
          firstName:'Joe',
          jurisdictions:'UK',
          lastName:'Bloggs',
          orgName:"name",
          paymentAccount:[]
      }
      }

      handleRegisterOrgRoute(request as Request, response as Response).then(response => {
     // handleRegisterOrgRoute(request as Request, {express:Response}).then(response => {
        console.log( 'INSIDE THE PACT TEST.....')
        console.log('logging response .....' + response)
        console.log('logging response.data .....' + JSON.stringify(response))
        //expect(response.data).to.eql("test")
        done()
      }, done)
    })
   })

})


export interface OrganisationCreationRequest{
  name: string
  status: string
  sraId: string
  paymentAccount: string[]
  superUser: UserCreationRequest
}
export interface UserCreationRequest{
  firstName: string
  lastName: string
}
const organisationRequestBody: OrganisationCreationRequest = {
  name:'firstname',
  status:'status',
  sraId:'sraId',
  paymentAccount:['pay1','pay2'],
  superUser:null
}
