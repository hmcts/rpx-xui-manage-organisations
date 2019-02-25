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
export class InviteUserService {
  constructor(private http: HttpClient) { }

  inviteUser(data): Observable<any> {
    return of(dummy);

  }


}
