import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { AppConstants } from '../../app/app.constants';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  describe('isAuthenticated', () => {
    it('should make a call to check authentication', inject([HttpTestingController, AuthService], (httpMock: HttpTestingController, service: AuthService) => {
      service.isAuthenticated().subscribe((response) => {
        expect(JSON.parse(String(response))).toBeFalsy();
      });

      const req = httpMock.expectOne('/auth/isAuthenticated');
      expect(req.request.method).toEqual('GET');
      req.flush('false');
    }));
  });

  describe('logOut', () => {
    it('should make a call to logOut', inject([HttpTestingController, AuthService], (httpMock: HttpTestingController, service: AuthService) => {
      const cookieSetterSpy = spyOnProperty(document, 'cookie', 'set');

      service.logOut().subscribe((response) => {
        expect(response).toBeNull();
      });

      expect(cookieSetterSpy).toHaveBeenCalledWith(
        `${AppConstants.SERVICE_MESSAGE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      );

      const req = httpMock.expectOne('/auth/logout?noredirect=true');
      expect(req.request.method).toEqual('GET');
      req.flush(null);
    }));
  });

  describe('signOut', () => {
    it('should clear the service message cookie and redirect to logout', inject([AuthService], (service: AuthService) => {
      const cookieSetterSpy = spyOnProperty(document, 'cookie', 'set');
      const locationSpy = spyOn(service, 'setWindowLocationHref');

      service.signOut();

      expect(cookieSetterSpy).toHaveBeenCalledWith(
        `${AppConstants.SERVICE_MESSAGE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      );
      expect(locationSpy).toHaveBeenCalledWith('/auth/logout');
    }));
  });

  describe('logOutAndRedirect', () => {
    it('should work', inject([AuthService], async (service: AuthService) => {
      const spyOnSetWindowLocation = spyOn(service, 'setWindowLocationHref');
      spyOn(service, 'logOut').and.returnValue(of(false));
      await service.logOutAndRedirect();
      expect(spyOnSetWindowLocation).toHaveBeenCalledWith('/idle-sign-out');
    }));
  });
});
