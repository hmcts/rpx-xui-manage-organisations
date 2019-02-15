import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import {select, Store} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';

import * as fromAuthStore from '../../auth/store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromAuthStore.AuthState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.pipe(
      select(fromAuthStore.isAuthenticated),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.store.dispatch(new fromAuthStore.LogIn({}));
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
