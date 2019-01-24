import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of} from 'rxjs';


const dummy = {
  id: '12345',
  name: 'Masood',
  email: 'something@domething.com'
};


@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  loginUer(sosos): Observable<any> {
    return of(dummy);

  }


}
