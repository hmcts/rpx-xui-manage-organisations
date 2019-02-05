import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';


const dummy = {
  id: '12345',
  firstname: 'test user saved response',
  lastname: 'something@domething.com'
};



@Injectable()
export class UserformService {
  constructor(private http: HttpClient) { }

  saveUser(): Observable<any> {
    return of(dummy);

  }


}
