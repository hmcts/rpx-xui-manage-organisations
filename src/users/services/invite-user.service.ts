import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as fromRoot from '../../../src/app/store';
import { Store, select } from '@ngrx/store';

import { Observable, switchMap } from 'rxjs';
import { UserListApiModel } from '../models/userform.model';

@Injectable()
export class InviteUserService {
  constructor(
    private readonly http: HttpClient,
    private readonly rootStore: Store<fromRoot.State>,
  ) {}

  // TODO add type when server returns someting.
  public inviteUser(data): Observable<UserListApiModel> {
    return this.rootStore.pipe(
      select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled),
      switchMap((ogdEnabled) => {
        const inviteUrl = ogdEnabled ? '/api/ogd-flow/invite' : '/api/inviteUser';
        return this.http.post<UserListApiModel>(inviteUrl, data);
      })
    );
  }
}
