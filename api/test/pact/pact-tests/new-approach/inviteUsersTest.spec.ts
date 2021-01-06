import {Pact} from '@pact-foundation/pact'
import {expect} from 'chai'
import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';

import {request, Request, Response,response} from 'express';
import {HttpClient as httpClient, HttpParams, HttpResponse} from '@angular/common/http';
import axios, { AxiosInstance,AxiosResponse } from 'axios';
import * as path from 'path'
import {organisationAddress} from '../../../../../src/register/constants/organisationAddress';
import { http } from '../../../../lib/http'
import {getConfigValue} from '../../../../configuration'
import {MICROSERVICE, S2S_SECRET, SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../../configuration/references';
import {inviteUserRoute} from '../../../../inviteUser';
import {PaymentAccountDto} from '../../../../lib/models/transactions';
import {getRefdataUserUrl} from '../../../../refdataUserUrlUtil';
import {organisationRequestBody} from '../pactFixtures.spec'
import {organisationCreationDto,newUser} from '../pactFixtures.spec'
import {InviteUserService, InviteUserService as inviteUserService} from '../../pact-tests/new-approach/InviteUserService';

const express = require('express');
const bodyParser = require('body-parser');

describe("RD Professional API get User URL ", () => {
  const rdProfessionalPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
  const port = 8992
  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: "xui_manage_org_organisation_details",
    provider: "referenceData_getUserUrl",// TODO Check with Ruban.
    pactfileWriteMode: "merge",
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        InviteUserService
      ],
    });
  });
  // Setup the provider
  before(() => provider.setup())

  // Write Pact when all tests done
  after(() => provider.finalize())

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify())

  describe("post Organisation", () => {

    const newUserCreationObject:newUser  = {
      firstName: "string",
      lastName: "string",
      sraId:"1111",
      status:"final",
      email: "string",
      roles: [
        "string"
      ],
      jurisdictions: [
        {
          id: "string"
        }
      ],
      resendInvite: true
    }

    before(done => {
      const interaction = {
        state: "registerOrganisations",
        uponReceiving: "referenceData_getUserUrl will respond with:",
        withRequest: {
          method: "POST",
          path: "/refdata/external/v1/organisations/users/",
          headers: {
            "Content-type":"application/x-www-form-urlencoded",
          },
          body: newUserCreationObject
          //body: Pact.Matchers.somethingLike(newUserCreationObject)

        },
         // withBody:{
         //   name:'firstname',
         //   status:'status',
         //   sraId:'sraId'
         // },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-type":"application/json;charset=utf-8"
          }
        },
      }
      // @ts-ignore
      provider.addInteraction(interaction).then(() => {
        done()
      })
    })

    it("returns the correct response", done => {

      const path  = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);

        const refdataUserUrl  =  getRefdataUserUrl(path);
        const axiosRequestConfig =  {
          method: 'POST ',
          headers: {
            "Content-type":"application/x-www-form-urlencoded"
          },
          // body:  {
          //       organisationRequestBody:organisationRequest
          // }
        }

        const headers = {
        "Content-type":"application/x-www-form-urlencoded"
      }

      // httpClient.
      const userService: InviteUserService = TestBed.get(InviteUserService);
      userService.create(newUserCreationObject).subscribe(response => {
        expect(response).to.deep.equal(200);
        done();
      }, error => {
        console.log('.......errror occurred on call to the userService')
        //done.fail(error);
      });

      // resp1.then((response) => {
      //     const  r = response.data
      //     expect(r.data.toString()).to.deep.eq("success")
      //     //expect(r.data).to.be.not.null; // .eq("success")
      //   }).then(done,done)




      // const express = require('express');
      // const bodyParser = require('body-parser');
      //
      // const app = express();
      // app.use(bodyParser.urlencoded({ extended: true }));
      // app.use(bodyParser.json());
      //
      // console.log('..............url to be hit is ' + refdataUserUrl );
      //
      // app.post(refdataUserUrl, (req, res) => {
      //   console.log('..............    Got body:', req.body);
      //   req.headers("Content-type:application/x-www-form-urlencoded");
      //   req.method("POST")
      //   req.body(newUserCreationObject);
      //   req.log(' logggin the body .... in the express request object ' + req.body)
      //   //console.log('Got body:', req.body);
      //   expect(res.should.deep.equal("success").then(done,done));
      // });

      //const resp1 = axios.post(refdataUserUrl,newUserCreationObject,axiosRequestConfig);





    })
   })




})
