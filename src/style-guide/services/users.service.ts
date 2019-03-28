import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


const dummy = [
  {
    email: 'somthing@something',
    manageCases: 'All',
    manageOrganisation: 'Yes',
    manageUsers: 'yes',
    manageFeeAcc: 'yes',
    status: 'active'
  },
  {
    email: 'xyz@something',
    manageCases: 'All',
    manageOrganisation: 'Yes',
    manageUsers: 'no',
    manageFeeAcc: 'no',
    status: 'active'
  }
]


@Injectable()
export class UsersService {
  constructor(private http: HttpClient) { }

  getListOfUsers(): Observable<any> {
    return this.http
      .get<any>(`/api/userList`)
      .pipe(catchError((error: any) => throwError(error.json())));
  }


}
