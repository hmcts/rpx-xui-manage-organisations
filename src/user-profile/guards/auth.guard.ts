import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';

import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as jwtDecode from 'jwt-decode';
import * as fromStore from '../store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie';
import config from '../../../api/lib/config';
import {environment} from '../../environments/environment';


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
      this.signOut();
      return false;
    }

    const jwtData = jwtDecode(jwt);
    const notExpired = jwtData.exp > Math.round(new Date().getTime() / 1000);

    if (!notExpired) {
      this.signOut();
    }
    return notExpired;
  }

  generateLoginUrl(): string {
    let API_BASE_URL = window.location.protocol + '//' + window.location.hostname;
    API_BASE_URL += window.location.port ? ':' + window.location.port : '';
    console.log('in base login url');
    const puiEnv = process.env.PUI_ENV
    console.log('pui env is',puiEnv)
    const base = config.services.idamWeb;
    const clientId = config.idamClient;
    const callback = `${API_BASE_URL}${config.oauthCallbackUrl}`;
    return `${base}?response_type=code&client_id=${clientId}&redirect_uri=${callback}`;

  }

  signOut(): void {
    window.location.href = this.generateLoginUrl();
  }
}

