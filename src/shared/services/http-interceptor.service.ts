import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HeadersService } from './headers.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app/store';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { _throw } from 'rxjs/observable/throw';
import 'rxjs/add/operator/catch';


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorServer implements HttpInterceptor {

  constructor(
    public router: Router,
    private authService: HeadersService,
    @Inject(PLATFORM_ID)
    private platformId: string,
    private store: Store<fromRoot.State>
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeaders = this.authService.getAuthHeaders();
    request = request.clone({
      setHeaders: authHeaders
    });

    return next.handle(request).catch(error => {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        this.store.dispatch(new fromRoot.Go({ path: ['/not-found'] }));

        return new EmptyObservable();
      } else {
        return _throw(error);
      }
    });
  }
}
