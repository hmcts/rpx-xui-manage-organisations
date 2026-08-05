import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, shareReplay } from 'rxjs/operators';
import { AppConstants } from '../../app/app.constants';
import { SessionStorageService } from '../../shared/services/session-storage.service';

@Injectable()
export class AuthService {
  private isAuthenticatedRequest$: Observable<boolean>;

  constructor(
    private readonly httpService: HttpClient,
    private readonly sessionStorageService: SessionStorageService
  ) {}

  public loginRedirect() {
    const href = '/auth/login';
    this.setWindowLocationHref(href);
  }

  public isAuthenticated(): Observable<boolean> {
    if (!this.isAuthenticatedRequest$) {
      this.isAuthenticatedRequest$ = this.httpService.get<boolean>('/auth/isAuthenticated').pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        finalize(() => {
          this.isAuthenticatedRequest$ = null;
        })
      );
    }

    return this.isAuthenticatedRequest$;
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
    globalThis.location.href = href;
  }

  private clearServiceMessageCookie(): void {
    document.cookie = `${AppConstants.SERVICE_MESSAGE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}
