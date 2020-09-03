import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService
  ) {
  }

  public canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().map( isAuth => {
      if (!isAuth) {
        this.authService.loginRedirect();
        return false;
      }
      return true;
    });
  }

}
