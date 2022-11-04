import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) { }

  // returnRoles true
  getAllUsersListwithReturnRoles(): Observable<any> {
    return this.http
       .get<any>(`/api/allUserList`)
       .pipe(catchError((error: any) => throwError(error.json())));
  }

  // returnRoles true with pageNumber
  getListOfUsers(pageNumber: number): Observable<any> {
    return this.http
       .get<any>(`/api/userList?pageNumber=${pageNumber}`)
       .pipe(catchError((error: any) => throwError(error.json())));
  }

  // get all users with returnRoles false
  getAllUsersList(): Observable<any> {
    return this.http
       .get<any>(`/api/allUserListWithoutRoles`)
       .pipe(catchError((error: any) => throwError(error.json())));
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

  getUserDetailsWithPermission(userId: string): Observable<any> {
    return this.http
        .get<any>(`/api/user-details?userId=${userId}`)
  }

}
