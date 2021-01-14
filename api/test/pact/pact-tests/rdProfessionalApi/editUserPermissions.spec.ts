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
import {UserProfileModel,EditUserPermissionsDto} from '../pactFixtures.spec'
import {editUserPermissions} from '../pactUtil';
import * as getPort from 'get-port'
const {Matchers} = require('@pact-foundation/pact');
const {somethingLike, like, eachLike} = Matchers;


describe("RD Professional API", () => {
  let mockServerPort: number
  let provider: Pact

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
        idamMessage: somethingLike("Permissions successfully Updated"),
        idamStatusCode: somethingLike("201")
      }
    }

    const requestPath = "/refdata/external/v1/organisations/users/"+userId;

    before(done => {
      const interaction = {
        state: "Edit permission for an existing User",
        uponReceiving: "The ReferenceDataApi will respond with",
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

    it("Returns the correct response", done => {
      // call the pactUtil's method which Calls The Downstream API directly without going through the Service Class.

      const taskUrl: string = `${provider.mockService.baseUrl}/refdata/external/v1/organisations/users/`+userId;
      const resp =  editUserPermissions(taskUrl,mockRequest as any);

      resp.then((response) => {
        const responseDto: EditUserPermissionsDto  = <EditUserPermissionsDto> response.data
        assertResponse(responseDto);
      }).then(done,done)
    })
  })
})

function assertResponse(dto:EditUserPermissionsDto):void{
  expect(dto.roleAdditionResponse.idamMessage).to.be.equal('Permissions successfully Updated');
  expect(dto.roleAdditionResponse.idamStatusCode).to.be.equal("201");
}
