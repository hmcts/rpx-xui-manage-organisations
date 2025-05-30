import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { AcceptTcService } from '../../../accept-tc/services/accept-tc.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { UserService } from '../../services/user.service';
import {
  GetUserDetails,
  GetUserDetailsFailure,
  GetUserDetailsSuccess,
  LoadHasAcceptedTC,
  LoadHasAcceptedTCFail, LoadHasAcceptedTCSuccess
} from '../actions';
import * as fromUserEffects from './user-profile.effects';
import { SessionStorageService } from '../../../shared/services/session-storage.service';

describe('User Profile Effects', () => {
  let actions$;
  let effects: fromUserEffects.UserProfileEffects;
  let loggerService: LoggerService;

  const userServiceMock = jasmine.createSpyObj('UserService', [
    'getUserDetails'
  ]);
  const acceptTandCSrviceMock = jasmine.createSpyObj('AcceptTcService', [
    'getHasUserAccepted',
    'acceptTandC'
  ]);

  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);
  const mockedSessionStorageService = jasmine.createSpyObj('mockedSessionStorageService', ['setItem']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock
        },
        {
          provide: AcceptTcService,
          useValue: acceptTandCSrviceMock
        },
        {
          provide: LoggerService,
          useValue: mockedLoggerService
        },
        {
          provide: SessionStorageService,
          useValue: mockedSessionStorageService
        },
        fromUserEffects.UserProfileEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    effects = TestBed.inject(fromUserEffects.UserProfileEffects);
    loggerService = TestBed.inject(LoggerService);

    initTestScheduler();
    addMatchers();
  }));

  describe('getUser$', () => {
    it('should return a UserInterface - GetUserDetailsSuccess', waitForAsync(() => {
      const returnValue = {
        userId: 'something',
        email: 'something',
        orgId: 'something',
        sessionTimeout: {
          idleModalDisplayTime: 10,
          pattern: '.',
          totalIdleTime: 50
        },
        roles: []
      };
      userServiceMock.getUserDetails.and.returnValue(of(returnValue));
      const action = new GetUserDetails();
      const completion = new GetUserDetailsSuccess(returnValue);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.getUser$).toBeObservable(expected);
      expect(mockedSessionStorageService.setItem).toHaveBeenCalledWith('userDetails', JSON.stringify(returnValue));
    }));
  });

  describe('getUser$ error', () => {
    it('should return GetUserDetailsFailure', waitForAsync(() => {
      userServiceMock.getUserDetails.and.returnValue(throwError(new HttpErrorResponse({})));
      const action = new GetUserDetails();
      const completion = new GetUserDetailsFailure(new HttpErrorResponse({}));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.getUser$).toBeObservable(expected);
    }));
  });

  describe('loadHasAccepted$', () => {
    it('should return a hasUserAccepted Object - LoadHasAcceptedTCSuccess', waitForAsync(() => {
      const returnValue = 'true';
      acceptTandCSrviceMock.getHasUserAccepted.and.returnValue(of(returnValue));
      const action = new LoadHasAcceptedTC('1234');
      const completion = new LoadHasAcceptedTCSuccess(returnValue);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadHasAccepted$).toBeObservable(expected);
    }));
  });

  describe('loadHasAccepted$ error', () => {
    it('should return LoadHasAcceptedFail', waitForAsync(() => {
      acceptTandCSrviceMock.getHasUserAccepted.and.returnValue(throwError(new HttpErrorResponse({})));
      const action = new LoadHasAcceptedTC('1234');
      const completion = new LoadHasAcceptedTCFail(new HttpErrorResponse({}));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadHasAccepted$).toBeObservable(expected);
    }));
  });

  describe('getUser$ error', () => {
    it('should return GetUserDetailsFailure', waitForAsync(() => {
      userServiceMock.getUserDetails.and.returnValue(throwError(new HttpErrorResponse({})));
      const action = new GetUserDetails();
      const completion = new GetUserDetailsFailure(new HttpErrorResponse({}));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.getUser$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    }));
  });

  describe('getUserFail$', () => {
    it('should return hardcoded UserInterface - GetUserDetailsSuccess', waitForAsync(() => {
      const returnValue = {
        email: 'hardcoded@user.com',
        orgId: '12345',
        roles: ['pui-case-manager', 'pui-user-manager', 'pui-finance-manager', 'pui-organisation-manager'],
        userId: '1',
        sessionTimeout: {
          idleModalDisplayTime: 10,
          totalIdleTime: 50
        }
      };
      const action = new GetUserDetailsFailure(new HttpErrorResponse({}));
      const completion = new GetUserDetailsSuccess(returnValue);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.getUserFail$).toBeObservable(expected);
    }));
  });
});
