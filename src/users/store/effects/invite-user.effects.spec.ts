import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { InviteUserService } from '../../services/invite-user.service';
import * as fromUsersActions from '../actions/invite-user.actions';
import * as fromUsersEffects from './invite-user.effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Invite User Effects', () => {
  let actions$;
  let loggerService: LoggerService;
  let effects: fromUsersEffects.InviteUserEffects;
  const inviteUsersServiceMock = jasmine.createSpyObj('InviteUserService', [
    'inviteUser'
  ]);

  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: InviteUserService,
          useValue: inviteUsersServiceMock
        },
        {
          provide: LoggerService,
          useValue: mockedLoggerService
        },
        fromUsersEffects.InviteUserEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    effects = TestBed.inject(fromUsersEffects.InviteUserEffects);
    loggerService = TestBed.inject(LoggerService);

    initTestScheduler();
    addMatchers();
  }));

  describe('saveUser$', () => {
    it('should handle dynamic payload correctly - InviteUserSuccess', waitForAsync(() => {
      const userRequestPayload = {
        firstName: 'Captain',
        lastName: 'Caveman',
        email: 'thecap@cave.com',
        permissions: ['god'],
        resendInvite: false
      };
      const orgProfileIdPayload = [
        'Solicitor_Profile'
      ];
      const mockUserDetails = { id: 'user123', name: 'Captain Caveman' };
      inviteUsersServiceMock.inviteUser.and.returnValue(of(mockUserDetails));
      const action = new fromUsersActions.SendInviteUser(userRequestPayload, orgProfileIdPayload);
      const completion = new fromUsersActions.InviteUserSuccess({ ...mockUserDetails, userEmail: 'thecap@cave.com' });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.saveUser$).toBeObservable(expected);
    }));

    it('should handle payload without orgProfileIds - InviteUserSuccess', waitForAsync(() => {
      const requestPayloadWithoutOrgIds = {
        firstName: 'Captain',
        lastName: 'Caveman',
        email: 'thecap@cave.com',
        permissions: ['god'],
        resendInvite: false
      };
      const mockUserDetailsWithoutOrgIds = { id: 'user123', name: 'Captain Caveman' };
      inviteUsersServiceMock.inviteUser.and.returnValue(of(mockUserDetailsWithoutOrgIds));
      const actionWithoutOrgIds = new fromUsersActions.SendInviteUser(requestPayloadWithoutOrgIds);
      const completionWithoutOrgIds = new fromUsersActions.InviteUserSuccess({ ...mockUserDetailsWithoutOrgIds, userEmail: 'thecap@cave.com' });

      actions$ = hot('-a', { a: actionWithoutOrgIds });
      const expectedWithoutOrgIds = cold('-b', { b: completionWithoutOrgIds });

      expect(effects.saveUser$).toBeObservable(expectedWithoutOrgIds);
    }));
  });

  describe('getUserInviteLoggerMessage', () => {
    it('user re-invited', () => {
      const message = fromUsersEffects.InviteUserEffects.getUserInviteLoggerMessage(true);
      expect(message).toEqual('User Re-Invited');
    });

    it('user invited', () => {
      const message = fromUsersEffects.InviteUserEffects.getUserInviteLoggerMessage(false);
      expect(message).toEqual('User Invited');
    });
  });

  describe('getErrorAction', () => {
    it('should return 400 Action', () => {
      const error = {
        apiError: '',
        apiStatusCode: 400,
        message: ''
      };

      let action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
      expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_400);

      error.apiStatusCode = 402;
      action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
      expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_400);

      error.apiStatusCode = 403;
      action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
      expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_400);

      error.apiStatusCode = 405;
      action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
      expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_400);
    });

    it('should return 404 Action', () => {
      const error = {
        apiError: '',
        apiStatusCode: 404,
        message: ''
      };

      const action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
      expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_404);
    });

    it('should return 429 Action', () => {
      const error = {
        apiError: '',
        apiStatusCode: 429,
        message: ''
      };

      const action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
      expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_429);
    });

    it('should return 500 Action', () => {
      const error = {
        apiError: '',
        apiStatusCode: 500,
        message: ''
      };

      const action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
      expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_500);
    });

    it('should return 409 Action', () => {
      const error = {
        apiError: '',
        apiStatusCode: 409,
        message: ''
      };

      const action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
      expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_409);
    });

    it('should return 422 Action', () => {
      const error = {
        apiError: '',
        apiStatusCode: 422,
        message: ''
      };

      const action = fromUsersEffects.InviteUserEffects.getErrorAction(error);
      expect(action.type).toEqual(fromUsersActions.INVITE_USER_FAIL_WITH_422);
    });
  });

  xdescribe('saveUser$ error', () => {
    it('should return InviteUserFail', waitForAsync(() => {
      inviteUsersServiceMock.inviteUser.and.returnValue(throwError(new Error()));
      const requestPayload = {
        firstName: 'Captain',
        lastName: 'Caveman',
        email: 'thecap@cave.com',
        permissions: ['god'],
        resendInvite: false
      };
      const action = new fromUsersActions.SendInviteUser(requestPayload);
      const completion = new fromUsersActions.InviteUserFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.saveUser$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    }));
  });
});
