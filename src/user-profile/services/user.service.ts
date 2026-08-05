import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { UserInterface } from '../models/user.model';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../src/app/store';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userDetails$: Observable<UserInterface>;

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
    if (!this.userDetails$) {
      this.userDetails$ = this.http.get<UserInterface>('/api/user/details').pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError((error) => {
          this.userDetails$ = null;
          return throwError(() => error);
        })
      );
    }

    return this.userDetails$;
  }
}
