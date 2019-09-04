import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';

import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as jwtDecode from 'jwt-decode';
import * as fromStore from '../store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie';
import config from '../../../api/lib/config';
import {AppUtils} from '../../app/utils/app-utils';
import {AppConstants} from '../../app/app.constants';


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
    const env = AppUtils.getEnvironment(window.location.origin);
    let API_BASE_URL = window.location.protocol + '//' + window.location.hostname;
    API_BASE_URL += window.location.port ? ':' + window.location.port : '';

    const base = AppConstants.REDIRECT_URL[env];

    const clientId = config.idamClient;
    const callback = `${API_BASE_URL}${config.oauthCallbackUrl}`;
    // tslint:disable-next-line: max-line-length
    return `${base}?response_type=code&client_id=${clientId}&redirect_uri=${callback}&scope=profile openid roles manage-user create-user manage-roles`;
  }

  signOut(): void {
    window.location.href = this.generateLoginUrl();
  }
}

