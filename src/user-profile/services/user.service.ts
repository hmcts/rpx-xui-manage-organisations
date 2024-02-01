import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../models/user.model';
import { EditUserModel } from '../models/editUser.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private readonly http: HttpClient) {}

  public editUserPermissions(editUser: EditUserModel): Observable<any> {
    return this.http.put(`/api/editUserPermissions/users/${editUser.id}`, editUser);
  }

  public getUserDetails(): Observable<UserInterface> {
    return this.http.get<UserInterface>('/api/user/details');
  }

  public refreshUser(idamId: string) {
    return this.http.post('/api/refresh-user', { idamId });
  }
}
