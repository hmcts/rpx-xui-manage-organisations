import {el} from '@angular/platform-browser/testing/src/browser_util';
import { Pact } from '@pact-foundation/pact'
import axios from 'axios';
import { expect } from 'chai'
import * as getPort from 'get-port';
import * as path from 'path'
import {request, Request} from 'express'
import {getConfigValue} from '../../../../configuration';
import {SERVICES_FEE_AND_PAY_API_PATH } from '../../../../configuration/references'
import {getRefdataUserUrl} from '../../../../refdataUserUrlUtil';
import {InviteUserResponse} from '../pactFixtures.spec'
import {inviteUser} from '../pactUtil';


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

  describe("Invite User", () => {

    const mockRequest = {
      "email": "Joe.bloggs@mailnesia.com",
      "firstName": "Joe",
      "lastName": "Bloggs",
      // "jurisdictions" // TODO Can't see in swagger but present in request from UI - TBC ?
      "roles": ["admin"],
      "resendInvite":true
    }

    const mockResponse = {
      idamStatus: "Created",
      userIdentifier: null
    }

    const requestPath = "/refdata/external/v1/organisations/users/";

    before(done => {
      const interaction = {
        state: "Invite a User",
        uponReceiving: "The ReferenceDataApi will respond if the User has been added succesfully",
        withRequest: {
          method: "POST",
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
      const taskUrl: string = `${provider.mockService.baseUrl}/refdata/external/v1/organisations/users/`;
      const resp =  inviteUser(taskUrl, mockRequest as any);
      resp.then((response) => {
        const responseDto: InviteUserResponse  = <InviteUserResponse> response.data
        assertResponse(responseDto);
      }).then(done,done)
    })
  })
})

function assertResponse(dto:InviteUserResponse):void{
  expect(dto.idamStatus).to.be.a('string');
  expect(dto.userIdentifier).to.be.a('null');
}
