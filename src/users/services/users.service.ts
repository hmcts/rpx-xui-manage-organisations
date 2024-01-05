import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  // returnRoles true
  public getAllUsersListwithReturnRoles(): Observable<any> {
    return this.http
      .get<any>('/api/allUserList')
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  // returnRoles true with pageNumber
  public getListOfUsers(pageNumber: number): Observable<any> {
    return this.http
      .get<any>(`/api/userList?pageNumber=${pageNumber}`)
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  // get all users with returnRoles false
  public getAllUsersList(): Observable<any> {
    return this.http
      .get<any>('/api/allUserListWithoutRoles')
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  public suspendUser(param): Observable<any> {
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
      .pipe(catchError((error: any) => throwError(error.json())));
  }

}
