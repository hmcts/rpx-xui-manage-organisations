import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';

import 'rxjs/add/operator/map';
import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as jwtDecode from 'jwt-decode';
import * as fromStore from '../store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie';
import config from '../../../api/lib/config';
import {AppUtils} from '../../app/utils/app-utils';
import {AppConstants} from '../../app/app.constants';
import {EnvironmentService} from '../../shared/services/environment.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.AuthState>,
    private cookieService: CookieService,
    private environmentService: EnvironmentService
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

  generateLoginUrl(): Observable<string> {
    let API_BASE_URL = window.location.protocol + '//' + window.location.hostname;
    API_BASE_URL += window.location.port ? ':' + window.location.port : '';

    const clientId = config.idamClient;
    const callback = `${API_BASE_URL}${config.oauthCallbackUrl}`;

    return this.environmentService.config$.map( environmentConfig => {
      const base = environmentConfig.idamWeb;
      // tslint:disable-next-line: max-line-length
      return `${base}?response_type=code&client_id=${clientId}&redirect_uri=${callback}&scope=profile openid roles manage-user create-user manage-roles`;
    });
  }

  signOut(): void {
    this.generateLoginUrl().subscribe( url => {
      window.location.href = url;
    });
  }
}

