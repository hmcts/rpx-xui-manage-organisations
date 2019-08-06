import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import * as jwtDecode from 'jwt-decode';
import config from '../../../api/lib/config';

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
   // this.API_BASE_URL = 'https://rd-professional-api-preview.service.core-compute-preview.internal';
  }


  getAuthHeaders() {
    interface HeaderObject {
      [key: string]: string;
    }
    let headers: HeaderObject = {};
    // if the cookie does not exist then do not set heathers so that
    // register organisation calls can get through
    const Authorization = this.cookieService.get(this.COOKIE_KEYS.TOKEN);
    if (Authorization)  {
       headers = {
          Authorization
      };
    }
    return headers;
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
