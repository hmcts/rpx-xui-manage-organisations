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
]


@Injectable()
export class UsersService {
  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<any> {
    return of(dummy)
    // return this.http
    //   .get<any>(`/api/pizzas`)
    //   .pipe(catchError((error: any) => throwError(error.json())));
  }


}
