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

  getSelectedUser(userIdentifier): Observable<any> {
    return this.http
       .get<any>(`/api/userDetails/${userIdentifier}`)
       .pipe(catchError((error: any) => throwError(error.json())));
  }

}
