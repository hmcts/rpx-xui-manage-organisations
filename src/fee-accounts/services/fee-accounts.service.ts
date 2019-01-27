import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

const feeAccountsDummy = [
  [
    { text: 'PBA0241163', routerLink: 'summary/PBA0241163' },
    { text: 'Wedlake Bell	- Account A' }
  ],
  [
    { text: 'PBA222333', routerLink: 'summary/PBA222333' },
    { text: 'Wedlake Bell	- Account B' }
  ]
];

const feeAccountSummaryDummy = {
  id: 'PBA0241163',
  name: 'Wedlake Bell	- Account A',
  availableCredit: '£17,254.00',
  balance: '£2746.00',
  lastUpdated: '15 October 2018 at 3:12pm'
};


@Injectable()
export class FeeAccountsService {
  constructor(private http: HttpClient) { }

  fetchFeeAccounts(): Observable<any> {
    return of(feeAccountsDummy);
  }

  fetchFeeAccountSummary(id): Observable<any> {
    return of(feeAccountSummaryDummy);
  }


}
