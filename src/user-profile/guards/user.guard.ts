import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
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
import {GetUserDetails} from '../store/actions';
import { userLoaded} from '../store/selectors';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private store: Store<fromAuth.AuthState>) {
  }

  canActivate(): Observable<boolean> {
    return this.checkStore()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  checkStore(): Observable<boolean> {
    return this.store.pipe(
      select(userLoaded),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new GetUserDetails());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
