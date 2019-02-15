///<reference path="../store/effects/singleFeeAccount.mock.ts"/>
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import {singleFeeAccountDummy} from '../store/effects/singleFeeAccount.mock';

const feeAccountsDummy = [
  { accountNumber: 'PBA0241163', accountName: 'Wedlake Bell	- Account A' },
  { accountNumber: 'PBA222333', accountName: 'Wedlake Bell	- Account B' }
];


@Injectable()
export class FeeAccountsService {
  constructor(private http: HttpClient) { }

  fetchFeeAccounts(): Observable<any> {
    return this.http.post('http://localhost:3000/api/account-fee/payments', {name: 'bpond'})
    // return of(feeAccountsDummy);
  }

  fetchSingleFeeAccount(id): Observable<any> {
    return of(singleFeeAccountDummy);
  }


}
