import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import * as jwtDecode from 'jwt-decode';
import config from '../../../api/lib/config';
import {CanActivate, Router} from '@angular/router';

import * as fromAuth from '../store';
import {Store} from '@ngrx/store';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    api_base_url: string;
    COOKIE_KEYS: {TOKEN: string, USER: string};

    constructor(private httpCilent: HttpClient,
                private cookieService: CookieService,
                private router: Router,
                private store: Store<fromAuth.AuthState> ) {

        this.COOKIE_KEYS = {
            TOKEN: config.cookies.token,
            USER: config.cookies.userId,
        };
        this.api_base_url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
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
            Authorization: this.cookieService.get(this.COOKIE_KEYS.TOKEN),
            [this.COOKIE_KEYS.USER]: this.cookieService.get(this.COOKIE_KEYS.USER)
        }
        return headers;
    }
    // TODO ADD THIS TO ACTION AND DISPATCH
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
        const jwtData = this.decodeJwt(jwt)
        const notExpired = jwtData.exp > Math.round(new Date().getTime() / 1000);
        // TODO revisit and discuss with Alan
        if (notExpired) {
          this.store.dispatch(new fromAuth.LogInSuccess(jwtData));
        } else {
          this.store.dispatch(new fromAuth.LogOut());
        }
        return notExpired;
    }
    // TODO TO NOT USE
    // signOut() {
    //     window.location.href = '/api/logout';
    // }
}
