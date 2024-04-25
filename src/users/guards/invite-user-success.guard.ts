import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import * as fromRoot from '../../app/store';
import * as fromStore from '../store';

@Injectable()
export class InviteUserSuccessGuard {
  constructor(
        private readonly store: Store<fromStore.UserState>
  ) {}

  public canActivate() {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  public checkStore(): Observable<boolean> {
    return this.store.pipe(select(fromStore.getInviteUserIsUserConfirmed),
      tap((isUserConfirmed) => {
        if (!isUserConfirmed) {
          this.store.dispatch(new fromRoot.Go({ path: ['users/invite-user'] }));
        }
      }),
      take(1)
    );
  }
}

