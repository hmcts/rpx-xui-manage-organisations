import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { HeadersService } from './headers.service';


@Injectable({
  providedIn: 'root'
})
export class HttpIntercepterServer implements HttpInterceptor {

  constructor(
    public router: Router,
    private readonly authService: HeadersService,
    @Inject(PLATFORM_ID)
    private readonly platformId: string
  ) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeaders = this.authService.getAuthHeaders();
    request = request.clone({
      setHeaders: authHeaders
    });

    return next.handle(request);
  }
}
