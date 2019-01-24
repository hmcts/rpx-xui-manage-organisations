import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';


const dummy =  [
  {
    email: 'somthing@something',
    manageCases: 'All',
    manageOrganisation: 'Yes',
    manageUsers: 'yes',
    manageFeeAcc: 'yes',
    status: 'active'
  }
];


@Injectable()
export class FeeAccountsService {
  constructor(private http: HttpClient) { }

  fetchFeeAccounts(): Observable<any> {
    alert();
    return of(dummy);
  }


}
