import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {response} from 'express';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators';
import {getConfigValue} from '../../../../configuration';
import {SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../../configuration/references';
import {newUser} from '../pactFixtures.spec';

@Injectable()
// @ts-ignore
export class InviteUserService {

  //private BASE_URL = '/user-service/users'

  private BASE_URL  = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)

  constructor(private httpClient: HttpClient) {
  }

  create(resource: newUser)  {

    console.log( '   ~~~~~~~~~~~ inside of the create()')
    console.log ( '.... printing out the newUser' +  JSON.stringify(resource))
    return this.httpClient.post(this.BASE_URL, resource).pipe(map(response => response))
//  .post(this.BASE_URL, resource).map(data => 200);


  }
}
