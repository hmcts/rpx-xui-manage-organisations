import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';

import {AuthService} from '../services/auth.service';
import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';

import * as fromStore from '../store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    private store: Store<fromStore.AuthState>
  ) {
  }

  canActivate() {
    // check if the cookie exits
    if (!this.authService.isAuthenticated()) {
      this.store.dispatch(new fromStore.LogOut());
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
}

