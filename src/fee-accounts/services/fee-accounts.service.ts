///<reference path="../store/effects/singleFeeAccount.mock.ts"/>
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import {singleFeeAccountDummy} from '../store/effects/singleFeeAccount.mock';
import {RequestOptions} from '@angular/http';

const feeAccountsDummy = [
  { accountNumber: 'PBA0241163', accountName: 'Wedlake Bell	- Account A' },
  { accountNumber: 'PBA222333', accountName: 'Wedlake Bell	- Account B' }
];


@Injectable()
export class FeeAccountsService {
  constructor(private http: HttpClient) { }



  fetchFeeAccounts(): Observable<any> {
    console.log('hitting itssss')
    let headers: HttpHeaders = new HttpHeaders();
    headers.set('Accept', 'application/json');
    headers.set('zumo-api-version', '2.0.0');

    return this.http.post('http://localhost:3000/api/account-fee/payments', {name: 'bpond'}, {headers})
    // return of(feeAccountsDummy);
  }

  fetchSingleFeeAccount(id): Observable<any> {
    return of(singleFeeAccountDummy);

    // this.http.get('https://swapi.co/api/people/1').subscribe(data => {
    //   console.log('data', data)
    // })

  }


}
