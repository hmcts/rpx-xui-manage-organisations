import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HeadersService } from './headers.service';

@Injectable({
  providedIn: 'root'
})
export class HttpIntercepterServer implements HttpInterceptor {

  constructor(
    public router: Router,
    private authService: HeadersService,
    @Inject(PLATFORM_ID)
    private platformId: string
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeaders = this.authService.getAuthHeaders();
    request = request.clone({
      setHeaders: authHeaders
    });

    return next.handle(request);
  }
}
