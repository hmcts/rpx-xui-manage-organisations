import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';


const dummy = [
  [
    { text: 'PBA0241163', routerLink: 'summary/PBA0241163' },
    { text: 'Wedlake Bell	- Account A' }
  ],
  [
    { text: 'PBA222333', routerLink: 'summary/PBA222333' },
    { text: 'Wedlake Bell	- Account B' }
  ]
];


@Injectable()
export class FeeAccountsService {
  constructor(private http: HttpClient) { }

  fetchFeeAccounts(): Observable<any> {
    return of(dummy);
  }


}
