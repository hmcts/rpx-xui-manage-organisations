import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from 'src/models/environmentConfig.model';
import config from '../../../api/lib/config';
import * as fromStore from '../store';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly store: Store<fromStore.AuthState>,
    private readonly cookieService: CookieService,
    @Inject(ENVIRONMENT_CONFIG) private readonly environmentConfig: EnvironmentConfig
  ) {
  }

  public canActivate(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return of(false);
    }
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  private checkStore(): Observable<boolean> {
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

  public isAuthenticated(): boolean {
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

  public generateLoginUrl(): string {
    const port = window.location.port ? `:${window.location.port}` : '';
    const API_BASE_URL = `${this.environmentConfig.protocol}://${window.location.hostname}${port}`;

    const clientId = config.idamClient;
    const callback = `${API_BASE_URL}${config.oauthCallbackUrl}`;

    const base = this.environmentConfig.idamWeb;
    // tslint:disable-next-line: max-line-length
    return `${base}?response_type=code&client_id=${clientId}&redirect_uri=${callback}&scope=profile openid roles manage-user create-user manage-roles`;
  }

  public signOut(): void {
    window.location.href = this.generateLoginUrl();
  }
}
