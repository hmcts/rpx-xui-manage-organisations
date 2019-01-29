import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';


const dummy = {
  id: '12345',
  firstname: 'Dummy firstname',
  lastname: 'Dummy lastname',
  email: 'something@domething.com',
  password: 'xxx',
  permissions: 'cases (all), organisation, users, payments',
};


@Injectable()
export class LoginService {
  constructor(private http: HttpClient) { }

  loginUer(): Observable<any> {
    return of(dummy);

  }


}
