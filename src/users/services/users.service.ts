import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) { }

  getListOfUsers(): Observable<any> {
    return this.http
       .get<any>(`/api/userList`)
       .pipe(catchError((error: any) => throwError(error.json())));
  }

  suspendUser(payload): Observable<any> {
    let user = payload.payload;
    user = {
      ...user,
      idamStatus: 'Suspend'
    };
    return this.http
       .put<any>(`/api/user/${user.userIdentifier}/suspend`, user)
       .pipe(catchError((error: any) => throwError(error.json())));
  }

}
