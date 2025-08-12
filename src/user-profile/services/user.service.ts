import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { UserInterface } from '../models/user.model';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../src/app/store';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly rootStore: Store<fromRoot.State>,
  ) {}

  public editUserPermissions(editUser): Observable<any> {
    return this.rootStore.pipe(
      select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled),
      switchMap((ogdEnabled) => {
        const editUrl = ogdEnabled ? '/api/ogd-flow/update/' : '/api/editUserPermissions/users/';
        const userId = ogdEnabled ? editUser.userPayload.id : editUser.id;
        return this.http.put(`${editUrl}${userId}`, editUser);
      })
    );
  }

  public getUserDetails(): Observable<UserInterface> {
    return this.http.get<UserInterface>('/api/user/details');
  }
}
