import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import * as fromAuth from '../store';
import { GetUserDetails } from '../store/actions';
import { userLoaded } from '../store/selectors';

@Injectable()
export class UserGuard  {
  constructor(private readonly store: Store<fromAuth.AuthState>) {}

  public canActivate(): Observable<boolean> {
    return this.checkStore()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  public checkStore(): Observable<boolean> {
    return this.store.pipe(
      select(userLoaded),
      tap((loaded) => {
        if (!loaded) {
          this.store.dispatch(new GetUserDetails());
        }
      }),
      filter((loaded) => loaded),
      take(1)
    );
  }
}
