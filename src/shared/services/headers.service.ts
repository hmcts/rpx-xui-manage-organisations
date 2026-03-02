import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';

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
      TOKEN: environment.cookies.token,
      USER: environment.cookies.userId
    };
    this.API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  }

  public getAuthHeaders() {
    interface HeaderObject {
      [key: string]: string;
    }
    let headers: HeaderObject = {};
    // if the cookie does not exist then do not set heathers so that
    // register organisation calls can get through
    const authorization = this.cookieService.get(this.COOKIE_KEYS.TOKEN);
    if (authorization) {
      headers = {
        Authorization: authorization
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
    return jwtData.exp > Math.round(new Date().getTime() / 1000);
  }

  public getJwt() {
    const jwt = this.cookieService.get(this.COOKIE_KEYS.TOKEN);
    if (!jwt) {
      return false;
    }
    return this.decodeJwt(jwt);
  }
}
