import { isPlatformBrowser } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Inject, Injector, PLATFORM_ID } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { HeadersService } from './headers.service';


@Injectable({
  providedIn: 'root'
})
export class AuthIntercepterServer implements HttpInterceptor  {

  constructor(public router: Router,
              private authService: HeadersService, @Inject(PLATFORM_ID)
              private platformId: string) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!isPlatformBrowser(this.platformId)) {
      const authHeaders = this.authService.getAuthHeaders();
      request = request.clone({
        setHeaders: authHeaders
      });
    }
    return next.handle(request);
  }
}
