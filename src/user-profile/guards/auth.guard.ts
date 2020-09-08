import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import {AuthService} from '../services/auth.service';
import * as fromStore from '../store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly store: Store<fromStore.AuthState>,
    public authService: AuthService
  ) {
  }

  public canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().map( isAuth => {
      if (!isAuth) {
        this.authService.loginRedirect();
        return false;
      }
      this.store.dispatch(new fromStore.GetUserDetails());
      return true;
    });
  }

}
