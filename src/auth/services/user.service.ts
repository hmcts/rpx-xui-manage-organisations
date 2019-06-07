import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {UserAddress, UserInterface} from '../models/user.model';
import {userMock} from '../mock/user.mock';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient) {}

  getUserDetails(): Observable<UserInterface> {
    const obj: UserInterface = userMock;
    return of(obj);
    // return this.http.get<UserInterface>(`/api/user/details`);
  }

}
