import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import * as jwtDecode from 'jwt-decode';
import config from '../../../api/lib/config';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {
  public COOKIE_KEYS;
  public API_BASE_URL;
  public user;

  constructor(
    private readonly cookieService: CookieService
  ) {
    this.COOKIE_KEYS = {
      TOKEN: config.cookies.token,
      USER: config.cookies.userId
    };
    this.API_BASE_URL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
   // this.API_BASE_URL = 'https://rd-professional-api-preview.service.core-compute-preview.internal';
  }


  public getAuthHeaders() {
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

  public decodeJwt(jwt) {
    return jwtDecode(jwt);
  }

  public isAuthenticated(): boolean {
    const jwtData = this.getJwt();
    if (jwtData === false) {
      return false;
    }
    const expired = jwtData.exp > Math.round(new Date().getTime() / 1000);

    // do stuff!!
    return expired;
  }

  public getJwt() {
    const jwt = this.cookieService.get(this.COOKIE_KEYS.TOKEN);
    if (!jwt) {
      return false;
    }
    return this.decodeJwt(jwt);
  }
}
