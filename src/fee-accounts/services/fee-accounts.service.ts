import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {map} from '../../../node_modules/rxjs/operators';
import {Payment, Payments} from '../models/pba-transactions';
import {feeAccountsDummy, PbaAccountsMock} from '../mock/pba-accounts.mock';
import {PbaAccounts} from '../models/pba-accounts';
import {PaymentMock} from '../../../api/accounts/data.mock';
import {SingleAccontSummary} from '../models/single-account-summary';
import {SingleAccontSummaryMock} from '../mock/sngleAccontSummary.mock';

@Injectable()
export class FeeAccountsService {
  constructor(private http: HttpClient) {
  }

  fetchFeeAccounts(): Observable<Array<PbaAccounts>> {
    const obj: PbaAccounts[] = PbaAccountsMock;
    return of(obj);
    // return this.http.get<Array<PbaAccounts>> (`/api/accounts/pbas/`);
  }
  // Overview load
  fetchSingleFeeAccount(payload): Observable<SingleAccontSummary> {
    const obj: SingleAccontSummary = SingleAccontSummaryMock;
    return of(obj);
    // return this.http.get(`/api/accounts/${payload.id}`);
  }
  // Overview transactions
  fetchPbAAccountTransactions(payload): Observable<any> {
    const obj: Payments = PaymentMock;
    const objMapped = obj.payments.map((item: Payment) => {
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

    return of(objMapped);
    // return this.http.get(`/api/accounts/${payload.id}/transactions`).pipe(
    //   map((item: Payment) => {
    //     return {
    //           paymentReference: item.payment_reference,
    //           case: item.case_reference,
    //           reference: 'NO DATA to MAP',
    //           submittedBy: 'NO DATA to MAP',
    //           status: 'NO DATA to MAP',
    //           dateCreated: item.date_created,
    //           amount: item.amount,
    //           dateUpdated: item.date_updated,
    //           routerLink: `account/${item.account_number}/summary`
    //      };
    //   })
    // );


  }

}
