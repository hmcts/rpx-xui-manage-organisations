import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {map} from '../../../node_modules/rxjs/operators';
import {Payment} from '../models/pba-transactions';
import {FeeAccount} from '../models/pba-accounts';
import {SingleAccountSummary} from '../models/single-account-summary';
import {SingleAccontSummaryMock} from '../mock/singleAccontSummary.mock';

@Injectable()
export class FeeAccountsService {
  constructor(private http: HttpClient) {
  }

  fetchFeeAccounts(paymentAccounts: string[]): Observable<Array<FeeAccount>> {
    const accounts = paymentAccounts.join(',');
    return this.http.get<Array<FeeAccount>> (`/api/accounts?accountNames=${accounts}`);
  }
  // Overview load
  fetchSingleFeeAccount(payload): Observable<SingleAccountSummary> {
    const obj: SingleAccountSummary = SingleAccontSummaryMock;
    return of(obj);
    // return this.http.get<SingleAccountSummary>(`/api/accounts/${payload.id}`);
  }
  // Overview transactions
  fetchPbAAccountTransactions(payload): Observable<Array<Payment>> {
    return this.http.get<Array<Payment>>(`/api/payments/${payload.id}`);
  }

}
