import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from '../../app/app.constants';
import { SessionStorageService } from '../../shared/services/session-storage.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpClient,
    private readonly sessionStorageService: SessionStorageService
  ) {}

  public loginRedirect() {
    const href = '/auth/login';
    this.setWindowLocationHref(href);
  }

  public isAuthenticated(): Observable<boolean> {
    return this.httpService.get<boolean>('/auth/isAuthenticated');
  }

  public signOut() {
    const href = '/auth/logout';
    this.clearServiceMessageCookie();
    this.setWindowLocationHref(href);
  }

  public logOut(): Observable<any> {
    this.clearServiceMessageCookie();
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

  private clearServiceMessageCookie(): void {
    document.cookie = `${AppConstants.SERVICE_MESSAGE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}
