import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { UsersService } from '../../services/users.service';
import { LoadUsers, LoadUsersFail, LoadUsersSuccess, SuspendUser, SuspendUserFail, SuspendUserSuccess } from '../actions/user.actions';
import * as fromUsersEffects from './users.effects';

describe('Users Effects', () => {
  let actions$;
  let effects: fromUsersEffects.UsersEffects;
  const usersServiceMock = jasmine.createSpyObj('UsersService', [
    'getListOfUsers', 'suspendUser',
  ]);
  let loggerService: LoggerService;

  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: LoggerService,
          useValue: mockedLoggerService
        },
        fromUsersEffects.UsersEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(fromUsersEffects.UsersEffects);
    loggerService = TestBed.inject(LoggerService);

    initTestScheduler();
    addMatchers();
  }));

  describe('loadUsers$', () => {
    it('should return a collection from loadUsers$ - LoadUsersSuccess', waitForAsync(() => {
      const payload = { users: [{ payload: 'something' }] };
      usersServiceMock.getListOfUsers.and.returnValue(of(payload));
      const action = new LoadUsers();
      const completion = new LoadUsersSuccess({
        users: [
          { payload: 'something', fullName: 'undefined undefined', routerLink: 'user/undefined', routerLinkTitle: 'User details for undefined undefined with id undefined' }
        ]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadUsers$).toBeObservable(expected);
    }));

    it('should return a collection from loadUsers$ when status pending - LoadUsersSuccess', waitForAsync(() => {
      const payload = { users: [{ idamStatus: 'PENDING' }] };
      usersServiceMock.getListOfUsers.and.returnValue(of(payload));
      const action = new LoadUsers();
      const completion = new LoadUsersSuccess({
        users: [
          { idamStatus: 'PENDING', fullName: 'undefined undefined', routerLink: 'user/undefined', routerLinkTitle: 'User details for undefined undefined with id undefined'  }
        ]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadUsers$).toBeObservable(expected);
    }));
  });

  describe('loadUsers$ error', () => {
    it('should return LoadUsersFail', waitForAsync(() => {
      usersServiceMock.getListOfUsers.and.returnValue(throwError(new Error()));
      const action = new LoadUsers();
      const completion = new LoadUsersFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadUsers$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    }));
  });

  describe('suspendUser$', () => {
    it('should return a collection from suspendUser$ - SuspendUserSuccess', waitForAsync(() => {
      const user = {
        userIdentifier: 'cfeba78e-ff81-49d5-8a65-55fa2a9c2424',
        firstName: 'Humpty',
        lastName: 'Dumpty',
        email: 'aa@aa.com',
        idamStatus: 'Suspend',
        idamStatusCode:  '',
        idamMessage: '19 No call made to SIDAM to get the user roles as user status is ‘Pending’',
        fullName: 'Humpty Dumpty',
        routerLink: 'user/cfeba78e-ff81-49d5-8a65-55fa2a9c2424',
        selected: false,
        status: 'Active'
      };
      usersServiceMock.suspendUser.and.returnValue(of({}));
      const action = new SuspendUser({payload: user});
      const completion = new SuspendUserSuccess({payload: user});
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.suspendUser$).toBeObservable(expected);
    }));
  });

  describe('suspendUser$ error', () => {
    it('should return LoadUsersFail', waitForAsync(() => {
      usersServiceMock.suspendUser.and.returnValue(throwError(new Error()));
      const action = new SuspendUser({});
      const completion = new SuspendUserFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.suspendUser$).toBeObservable(expected);
    }));
  });
});
