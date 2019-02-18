import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';

import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
  ) {
  }

  canActivate() {
    if (!this.authService.isAuthenticated()) {
      this.authService.loginRedirect();
      return false;
    }

    return true;
  }
}

