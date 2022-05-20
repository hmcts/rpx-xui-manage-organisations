import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) { }

  getListOfUsers(pageNumber): Observable<any> {
    return this.http
       .get<any>(`/api/userList?pageNumber=${pageNumber}`)
       .pipe(catchError((error: any) => throwError(error.json())));
  }

  getUserDetailsWithPermission(pageNumber: number): Observable<any> {
    // return this.http.get<any>(`api/userDetails?returnRoles=true&size=1&page=${pageNumber}`).pipe(catchError((error: any) => throwError(error.json())));
    return this.http.get<any>(`api/userDetails`).pipe(catchError((error: any) => throwError(error.json())));
  }

  suspendUser(param): Observable<any> {
    let user = param.payload;
    user = {
      ...user,
      idamStatus: 'SUSPENDED'
    };
    return this.http
       .put<any>(`/api/user/${user.userIdentifier}/suspend`, user)
       .pipe(catchError((error: any) => throwError(error.json())));
  }

}
