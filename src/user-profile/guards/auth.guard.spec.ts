import { TestBed, inject } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import {combineReducers, StoreModule} from '@ngrx/store';
import {reducers} from '../../app/store/reducers';
import * as fromAuth from '../store';
import {CookieOptionsProvider, CookieService} from 'ngx-cookie';

const AuthServiceMock = {
    auth: false,
    isAuthenticated: () => {
        return AuthServiceMock.auth;
    },
    setAuth: key => {
        return AuthServiceMock.auth = key;
    },
    loginRedirect: () => {
        return true;
    }
};

const cookieService = {
  get: key => {
    return cookieService[key];
  },
  set: (key, value) => {
    cookieService[key] = value;
  },
  removeAll: () => { }
};


describe('AuthGuard', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot(
              {
                ...reducers,
                userProfile: combineReducers(fromAuth.reducer)
              })
          ],
          providers: [
            AuthGuard,
            { provide: CookieService, useValue: cookieService }
          ]
        });
    });

    describe('canActivate', () => {
        it('should return false if not authenticated', inject([AuthGuard], (authGuard: AuthGuard) => {
            AuthServiceMock.setAuth(false);
            expect(authGuard.canActivate()).toEqual(false);
        }));

        it('should return true if authenticated', inject([AuthGuard], (authGuard: AuthGuard) => {
            AuthServiceMock.setAuth(true);
            expect(authGuard.canActivate()).toEqual(false);
        }));

    });

});
