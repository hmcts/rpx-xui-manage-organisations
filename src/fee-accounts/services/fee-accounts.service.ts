import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { singleAccontSummaryMock } from '../mock/singleAccontSummary.mock';
import { FeeAccount } from '../models/pba-accounts';
import { Payment } from '../models/pba-transactions';
import { SingleAccountSummary } from '../models/single-account-summary';

@Injectable()
export class FeeAccountsService {
  constructor(private readonly http: HttpClient) {}

  public fetchFeeAccounts(paymentAccounts: string[]): Observable<FeeAccount[]> {
    const accounts = paymentAccounts.join(',');
    return this.http.get<FeeAccount[]> (`/api/accounts?accountNames=${accounts}`);
  }
  // Overview load
  public fetchSingleFeeAccount(payload): Observable<SingleAccountSummary> {
    const obj: SingleAccountSummary = singleAccontSummaryMock;
    return of(obj);
    // return this.http.get<SingleAccountSummary>(`/api/accounts/${payload.id}`);
  }
  // Overview transactions
  public fetchPbAAccountTransactions(payload): Observable<Payment[]> {
    return this.http.get<Payment[]>(`/api/payments/${payload.id}`);
  }
}
