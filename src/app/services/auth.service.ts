import { Injectable } from '@angular/core';


@Injectable()
export class AuthService {

  signOut() {
    window.location.href = '/api/logout';
  }
}
