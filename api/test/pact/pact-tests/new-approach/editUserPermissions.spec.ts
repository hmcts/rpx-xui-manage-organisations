import {el} from '@angular/platform-browser/testing/src/browser_util';
import { Pact } from '@pact-foundation/pact'
import axios from 'axios';
import { expect } from 'chai'
import * as path from 'path'
import {request, Request} from 'express'
import {getConfigValue} from '../../../../configuration';
import {SERVICES_FEE_AND_PAY_API_PATH } from '../../../../configuration/references'
import {getRefdataUserUrl} from '../../../../refdataUserUrlUtil';
import {getOrganisationId} from '../../../../services/rdProfessional';
import {PaymentAccountDto,Payments } from '../../../../lib/models/transactions';
import {postOrganisation} from '../../../../services/rdProfessional';
import {UserProfileModel,EditUserPermissionsDto} from '../../pact-tests/pactFixtures.spec'
import {editUserPermissions} from '../../pact-tests/new-approach/pactUtil';


describe("RD Professional API", () => {
  const port = 8993
  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "getAccounts",
    provider: "fee_And_Payments_API",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })

  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  describe("Edit UserPermssions given userId", () => {

    const userId = '123456';

    const mockRequest = {
      "email": "Joe.bloggs@mailnesia.com",
      "firstName": "Joe",
      "lastName": "Bloggs",
      "idamStatus": "active",
      "rolesAdd": [
        {
          "name": "superuser"
        }
      ]
    }

    const mockResponse = {
      "roleAdditionResponse": {
        "idamMessage": "Permissions successfully Updated",
        "idamStatusCode": "201"
      }
    }

    const requestPath = "/refdata/external/v1/organisations/users/123456";

    before(done => {
      const interaction = {
        state: "Details exists for the User",
        uponReceiving: "referenceData_organisationalExternalPbas will respond with:",
        withRequest: {
          method: "PUT",
          headers: {
            "Content-Type":  "application/json;charset=utf-8",
            "Authorization":  "Bearer some-access-token",
            "ServiceAuthorization": "serviceAuthToken"
          },
          path: requestPath,
          body: mockRequest,
        },
        willRespondWith: {
          headers: {
            "Content-Type": "application/json",
          },
          status: 201,
          body:mockResponse
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {
      // call the pactUtil's method which Calls The Downstream API directly without going through the Service Class.
      const userId = '123456';
      const resp =  editUserPermissions(userId,mockRequest as any);

      resp.then((response) => {
        const responseDto: EditUserPermissionsDto  = <EditUserPermissionsDto> response.data
        assertResponse(responseDto);
      }).then(done,done)
    })
  })
})

function assertResponse(dto:EditUserPermissionsDto):void{
  expect(dto.roleAdditionResponse.idamMessage).equals("Permissions successfully Updated");
  expect(dto.roleAdditionResponse.idamStatusCode).equals("201");
}
