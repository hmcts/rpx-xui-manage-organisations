///<reference path="../store/effects/singleFeeAccount.mock.ts"/>
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import {singleFeeAccountDummy} from '../store/effects/singleFeeAccount.mock';

const feeAccountsDummy = [
  { accountNumber: 'PBA0066906', accountName: 'Hard coded Wedlake Bell	- Account A' },
  { accountNumber: 'PBA0077597', accountName: 'Hard coded Wedlake Bell	- Account B' }
];


@Injectable()
export class FeeAccountsService {
  constructor(private http: HttpClient) { }

  fetchFeeAccounts(): Observable<any> {

    return of(feeAccountsDummy);
  }

  fetchSingleFeeAccount(payload): Observable<any> {
    console.log('fetchSingleFeeAccount id', payload.id)
    // return of(singleFeeAccountDummy);
    return this.http.get(`/api/accounts/account/${payload.id}`);
  }

  fetchPbAAccountTransactions(payload): Observable<any>{
    return this.http.get(`/api/accounts/account/${payload.id}/transactions`);

  }

}
