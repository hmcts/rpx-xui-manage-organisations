import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {UserListApiModel} from '../models/userform.model';

const dummy = {
  firstname: 'John',
  lastname: 'Smith',
  emailaddress: 'duda@dudee.com',
  permission: ['permission1', 'permission2']
};

@Injectable()
export class InviteUserService {
  constructor(private http: HttpClient) { }
  // TODO add type when server returns someting.
  inviteUser(data): Observable<any> {
    return this.http.post<UserListApiModel>('api/inviteUser', data);
  }


}
