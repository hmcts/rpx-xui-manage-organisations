import { inject, TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { LoaderInterceptorService } from './loader-interceptor.service';
import { LoaderService } from './loader.service';

describe('LoaderInterceptorService', () => {
  let loaderService: jasmine.SpyObj<LoaderService>;

  beforeEach(() => {
    loaderService = jasmine.createSpyObj<LoaderService>('LoaderService', ['show', 'hide']);
    TestBed.configureTestingModule({
      providers: [
        LoaderInterceptorService,
        { provide: LoaderService, useValue: loaderService }
      ]
    });
  });

  it('should be created', inject([LoaderInterceptorService], (service: LoaderInterceptorService) => {
    expect(service).toBeTruthy();
  }));

  it('should not show the global loader for translation requests', inject([LoaderInterceptorService], (service: LoaderInterceptorService) => {
    const handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
    handler.handle.and.returnValue(of(new HttpResponse()));

    service.intercept(new HttpRequest('POST', '/api/translation/cy'), handler).subscribe();

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(loaderService.hide).not.toHaveBeenCalled();
  }));

  it('should show and hide the global loader for other requests', inject([LoaderInterceptorService], (service: LoaderInterceptorService) => {
    const handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
    handler.handle.and.returnValue(of(new HttpResponse()));

    service.intercept(new HttpRequest('GET', '/api/users'), handler).subscribe();

    expect(loaderService.show).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
  }));
});
