import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import * as fromStore from '../store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly store: Store<fromStore.AuthState>,
    public authService: AuthService
  ) {
  }

  public canActivate() {
    const obsOne1$ = this.isAuthenticated();
    const obsTwo$ = this.checkUserStore();
    return obsOne1$.pipe(switchMap((isAuth) => isAuth ? obsTwo$ : of(false)));
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(map(isAuth => {
      if (!isAuth) {
        this.authService.loginRedirect();
        return false;
      }
      return true;
    }));
  }

  public checkUserStore(): Observable<boolean> {
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
}
