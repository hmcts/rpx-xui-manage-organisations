import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';


const dummy = {
  firstname: 'John',
  lastname: 'Smith',
  emailaddress: 'duda@dudee.com',
  permission: ['permission1', 'permission2']
};



@Injectable()
export class UserformService {
  constructor(private http: HttpClient) { }

  saveUser(data): Observable<any> {
    return of(dummy);

  }


}
