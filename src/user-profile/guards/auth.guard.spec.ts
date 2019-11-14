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
  let guard: AuthGuard;
  let mockStore: any;
  let mockService: any;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('mockStore', ['unsubscribe', 'dispatch', 'pipe']);
    mockService = jasmine.createSpyObj('mockService', ['get']);
    guard = new AuthGuard(mockStore, mockService);
  });

  describe('canActivate', () => {
    it('is Truthy', () => {
      expect(guard).toBeTruthy();
    });
  });

});
