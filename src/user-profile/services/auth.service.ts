import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { SessionStorageService } from 'src/shared/services/session-storage.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpClient,
    private readonly sessionStorageService: SessionStorageService
  ) {
  }

  public loginRedirect() {
    const href = '/auth/login';
    this.setWindowLocationHref(href);
  }

  public isAuthenticated(): Observable<boolean> {
    return this.httpService.get<boolean>('/auth/isAuthenticated');
  }

  public signOut() {
    const href = '/auth/logout';
    this.sessionStorageService.removeItem(AppConstants.SERVICE_MESSAGE_COOKIE);
    this.setWindowLocationHref(href);
  }

  public logOut(): Observable<any> {
    this.sessionStorageService.removeItem(AppConstants.SERVICE_MESSAGE_COOKIE);
    return this.httpService.get('/auth/logout?noredirect=true');
  }

  public logOutAndRedirect() {
    this.logOut().subscribe(() => {
      this.setWindowLocationHref('/idle-sign-out');
    });
  }

  public setWindowLocationHref(href: string) {
    window.location.href = href;
  }
}
