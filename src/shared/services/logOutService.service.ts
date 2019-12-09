import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LogOutService {
  constructor(private http: HttpClient) { }

  logOut(): Observable<any> {
    return this.http.get('api/logout');
  }
}
