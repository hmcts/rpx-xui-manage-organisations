import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';

import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as jwtDecode from 'jwt-decode';
import * as fromStore from '../store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie';
import * as fromAuth from '../store';
import config from '../../../api/lib/config';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.AuthState>,
    private cookieService: CookieService,
  ) {
  }

  canActivate() {
    if (!this.isAuthenticated()) {
      return false;
    }
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.pipe(select(fromStore.userLoaded),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.GetUserDetails());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }

  isAuthenticated(): boolean {
    const jwt = this.cookieService.get(config.cookies.token);
    if (!jwt) {
      this.store.dispatch(new fromAuth.LogOut());
      return false;
    }

    const jwtData = jwtDecode(jwt);
    const notExpired = jwtData.exp > Math.round(new Date().getTime() / 1000);

    if (!notExpired) {
      this.store.dispatch(new fromAuth.LogOut());
    }
    return notExpired;
  }
}

