import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable()
export class LogOutKeepAliveService {
  constructor(private http: HttpClient) { }

  logOut(): Observable<any> {
    return this.http.get('api/logout?noredirect="null"');
  }

  heartBeat(): Observable<any> {
    // return of('somethig')
    return this.http.get('auth/keepalive');
  }
}
