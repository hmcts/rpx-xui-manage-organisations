import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {expect} from "chai";
import * as path from 'path'
import {PaymentAccountDto} from '../../../../lib/models/transactions';
import {organisation} from '../pactFixtures.spec';
import {UserService} from './user.service';
import {User} from './user';
//import {PactWeb,Matchers} from '@pact-foundation/pact-web';
import { Pact } from '@pact-foundation/pact'

// import {PactWeb} from '@pact-foundation/pact-web';
//import {Matchers} from '@pact-foundation/pact-node'
//import {PactWeb} from '@pact-foundation/pact/pact-web';

describe('UserService', () => {
  let provider;
  const port = 8993
  provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "api/test/pact/logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "api/test/pact/pacts"),
    spec: 2,
    consumer: 'ui',
    provider: 'userservice',
    pactfileWriteMode: "merge",
  })

  // Setup the provider
  before(() => provider.setup());
  // required for slower CI environments
  //setTimeout(done, 2000);
  // Required if run with `singleRun: false`
  //provider.removeInteractions();

  after(() => provider.finalize())

  // afterAll(function (done) {
  //   provider.finalize()
  //     .then(function () {
  //       done();
  //     }, function (err) {
  //       done.fail(err);
  //     });
  // });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        UserService
      ],
    });
  });

  afterEach(() => provider.verify());

  describe('create()', () => {

    const expectedUser: User = {
      firstName: 'Arthur',
      lastName: 'Dent'
    };

    const createdUserId = 42;

    before((done) => {
      provider.addInteraction({
        state: `provider accepts a new person`,
        uponReceiving: 'a request to POST a person',
        withRequest: {
          method: 'POST',
          path: '/user-service/users',
          body: expectedUser,
          headers: {
            'Content-Type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          // body: Matchers.somethingLike({
          //   id: createdUserId
          // }),
          body: createdUserId,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });
    });

    it('should create a Person', done => {
      console.log('..... before call to TestBed')

      const userService: UserService = TestBed.get(UserService);

      console.log('..... AFter call to TestBed')

      // const response = userService.createWithAxios(expectedUser);
      // response.then((axRes) => {
      //   console.log(' back in the TEST ....  assertion call.....');
      //
      //   expect(axRes).to.deep.equal(200);
      // }).then(done, done)
      //

      // userService.create(expectedUser).subscribe(response => {
      //   expect(response).deep.equal(createdUserId);
      //   done();
      // }, error => {
      //   done.apply(this)
      // });
    })

  })



})
