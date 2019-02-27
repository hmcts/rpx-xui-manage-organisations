import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/do';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HeadersService } from './headers.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';


@Injectable({
  providedIn: 'root'
})
export class HttpIntercepterServer implements HttpInterceptor  {

  constructor(public router: Router,
              private authService: HeadersService, @Inject(PLATFORM_ID)
              private platformId: string) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const authHeaders = this.authService.getAuthHeaders();
      request = request.clone({
        setHeaders: authHeaders
      });

    return next.handle(request);
  }
}
