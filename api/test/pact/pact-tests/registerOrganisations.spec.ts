import { Pact } from '@pact-foundation/pact'
import { expect } from 'chai'
import * as path from 'path'
import {getConfigValue} from '../../../configuration'
import {SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../configuration/references'
import {getOrganisationId} from '../../../services/rdProfessional'
import {getOrganisationIdAxios} from '../../../services/rdProfessional';
import { PaymentAccountDto } from '../../../lib/models/transactions'
import {request, Request} from 'express'
import {response, Response} from 'express'
import { AxiosResponse } from 'axios'
import { http } from '../../../lib/http'
import { mockReq, mockRes } from 'sinon-express-mock'
import {handleOrganisationRoute} from '../../../../api/organisation'

describe("RD Professional API Register Organisation", () => {
  //const req = mockReq()
  //req.http = http(req)
  //const res = mockRes()

  const port = 8992;

  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "xui_manage_register_organisation",
    provider: "referenceData_registerOrganisation",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })

  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  describe("Register Organisation", () => {

    const jwt = 'some-access-token'
    const details = ''; // ATM this is not being used in the Service.

    before(done => {
      const interaction = {
        state: "Request for Register Organisation",
        uponReceiving: "referenceData_registerOrganisation will respond with:",
        withRequest: {
          method: "GET",
          path: "/refdata/external/v1/organisations",
          headers: {
               Authorization: "Bearer some-access-token"
          },
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

    it("Register Organisation returns the correct response", done => {

      const axiosRequest = http({
        session: {
          auth: {
            token: jwt,
          },
        },
      } as unknown as Request)

      //axiosInstance.

      //const axiosResp = response()as unknown as Response)


      handleOrganisationRoute(request,response).then(response => {
        console.log(response);
        // expect(response.data).to.eql(responsePaymentAccountDto)
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
})
