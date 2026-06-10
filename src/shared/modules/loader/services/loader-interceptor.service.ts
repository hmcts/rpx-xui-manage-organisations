import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {
  constructor(private readonly loaderService: LoaderService) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldSkipLoader(req)) {
      return next.handle(req);
    }

    this.showLoader();
    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this.onEnd();
      }
    },
    () => {
      this.onEnd();
    }));
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }

  private shouldSkipLoader(req: HttpRequest<any>): boolean {
    return req.url.startsWith('/api/translation');
  }
}
