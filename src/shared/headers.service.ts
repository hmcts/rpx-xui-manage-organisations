import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import * as jwtDecode from 'jwt-decode';
import config from '../../api/lib/config';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {
  COOKIE_KEYS;
  api_base_url;
  user;

  constructor(
    private cookieService: CookieService
  ) {
    this.COOKIE_KEYS = {
      TOKEN: config.cookies.token,
      USER: config.cookies.userId
    }
    this.api_base_url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port
  }

  generateLoginUrl() {
    const base = config.services.idam.idamLoginUrl;
    const clientId = config.services.idam.idamClientID;
    const callback = `${this.api_base_url}${config.services.idam.oauthCallbackUrl}`;
    return `${base}?response_type=code&client_id=${clientId}&redirect_uri=${callback}`;
  }

  getAuthHeaders() {
    interface HeaderObject {
      [key: string]: string;
    }
    const headers: HeaderObject = {
      Authorization: this.cookieService.get(this.COOKIE_KEYS.TOKEN)
    }
    return headers;
  }


  loginRedirect() {
    window.location.href = this.generateLoginUrl()
  }

  decodeJwt(jwt) {
    return jwtDecode(jwt)
  }

  isAuthenticated(): boolean {
    const jwt = this.cookieService.get(this.COOKIE_KEYS.TOKEN);
    if (!jwt) {
      return false;
    }
    const jwtData = this.decodeJwt(jwt);
    const expired = jwtData.exp > new Date().getTime();
    // do stuff!!
    return !expired;
  }
}
