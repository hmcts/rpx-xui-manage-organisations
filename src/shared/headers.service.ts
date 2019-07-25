import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import * as jwtDecode from 'jwt-decode';
import config from '../../api/lib/config';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {
  COOKIE_KEYS;
  API_BASE_URL;
  user;

  constructor(
    private cookieService: CookieService
  ) {
    this.COOKIE_KEYS = {
      TOKEN: config.cookies.token,
      USER: config.cookies.userId
    };
    this.API_BASE_URL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
  }

  generateLoginUrl() {
    const base = config.services.idam.idamLoginUrl;
    const clientId = config.services.idam.idamClientID;
    const callback = `${this.API_BASE_URL}${config.services.idam.oauthCallbackUrl}`;
    return `${base}?response_type=code&client_id=${clientId}&redirect_uri=${callback}&scope=manage-user create-user`;
  }

  getAuthHeaders() {
    interface HeaderObject {
      [key: string]: string;
    }
    const headers: HeaderObject = {
      Authorization: this.cookieService.get(this.COOKIE_KEYS.TOKEN)
    };
    return headers;
  }


  loginRedirect() {
    window.location.href = this.generateLoginUrl();
  }

  decodeJwt(jwt) {
    return jwtDecode(jwt);
  }

  isAuthenticated(): boolean {
    const jwt = this.cookieService.get(this.COOKIE_KEYS.TOKEN);
    if (!jwt) {
      return false;
    }
    const jwtData = this.decodeJwt(jwt);
    const expired = jwtData.exp > Math.round(new Date().getTime() / 1000);

    // do stuff!!
    return expired;
  }
}
