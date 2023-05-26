import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { UserListApiModel } from '../models/userform.model';

@Injectable()
export class InviteUserService {
  constructor(private readonly http: HttpClient) {}
  // TODO add type when server returns someting.
  public inviteUser(data): Observable<any> {
    return this.http.post<UserListApiModel>('api/inviteUser', data);
  }
}
