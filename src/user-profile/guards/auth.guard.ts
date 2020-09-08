import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { filter, map, take, tap } from 'rxjs/operators';
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
    return combineLatest([this.checkUserStore(), this.isAuthenticated()]).pipe(
      map(([isUserLoadedInStore, isAuthenticated]) => {
        return isUserLoadedInStore && isAuthenticated;
      }),
    );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(map(isAuth => {
      if (!isAuth) {
        this.authService.loginRedirect();
        return false;
      }
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
