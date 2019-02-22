///<reference path="../store/effects/singleFeeAccount.mock.ts"/>
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import {singleFeeAccountDummy} from '../store/effects/singleFeeAccount.mock';
import {Payment, Payments} from '../models/pba-transactions';
import {map} from '../../../node_modules/rxjs/operators';
import {PaymentsMock} from '../mock/transactions.mock';

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
    console.log('fetchSingleFeeAccount id', payload.id);
    // return of(singleFeeAccountDummy);
    return this.http.get(`/api/accounts/account/${payload.id}`);
  }

  fetchPbAAccountTransactions(payload): Observable<any>{
    // return this.http.get(`/api/accounts/account/${payload.id}/transactions`)
      return of( PaymentsMock.payments.map( (item: Payment ) => {
        return {
          paymentReference: item.payment_reference,
          case: item.case_reference,
          reference: 'NO DATA to MAP',
          submittedBy: 'NO DATA to MAP',
          status: 'NO DATA to MAP',
          dateCreated: item.date_created,
          amount: item.amount,
          dateUpdated: item.date_updated,
          routerLink: `account/${item.account_number}/summary`
        };
      }));
}
