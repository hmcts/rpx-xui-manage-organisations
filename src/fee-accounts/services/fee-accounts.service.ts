
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {map} from '../../../node_modules/rxjs/operators';
import {Payment, Payments} from '../models/pba-transactions';
import {PaymentsMock} from '../mock/transactions.mock';
import {feeAccountsDummy} from '../mock/pba-accounts.mock';
import {PbaAccounts} from '../models/pba-accounts';

@Injectable()
export class FeeAccountsService {
  constructor(private http: HttpClient) {
  }

  fetchFeeAccounts(): Observable<Array<PbaAccounts>> {
    return this.http.get<Array<PbaAccounts>> (`/api/accounts/account/pbas/`);
  }
  // Overview load
  fetchSingleFeeAccount(payload): Observable<any> {
    return this.http.get(`/api/accounts/account/${payload.id}`);
  }
  // Overview transactions
  fetchPbAAccountTransactions(payload): Observable<any> {
    return this.http.get(`/api/accounts/account/${payload.id}/transactions`).pipe(
      map((item: Payment) => {
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
      })
    )
  }

}
