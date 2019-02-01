import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromLoginUserEffects from './login.effects';
import { LoginEffects } from './login.effects';
import { LoginUser, LoginUserFail } from '../actions/login.actions';
import { LoginUserSuccess } from '../actions';
import { LoginService } from 'src/login/services';

describe('Fee accounts Effects', () => {
  let actions$;
  let effects: LoginEffects;
  const LoginServiceMock = jasmine.createSpyObj('LoginService', [
    'loginUser',
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          {
            provide: LoginService,
            useValue: LoginServiceMock,
          },
          fromLoginUserEffects.LoginEffects,
          provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(LoginEffects);

  });
  describe('logIn$', () => {
    it('should return a collection from logIn$ - LoginUserSuccess', () => {
      const payload = {
        firstname: 'John',
        lastname: 'Smith',
        email: 'duda@dudee.com',
        password: 'qwerty',
        permission: 'superuser'
      };
      LoginServiceMock.loginUser.and.returnValue(of(payload));
      const action = new LoginUser({userName: 'dummy', password: 'qwerty'});
      const completion = new LoginUserSuccess({
        firstname: 'John',
        lastname: 'Smith',
        email: 'duda@dudee.com',
        password: 'qwerty',
        permission: 'superuser'
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.logIn$).toBeObservable(expected);
    });
  });

  describe('logIn$ error', () => {
    it('should return LoginUserFail', () => {
      LoginServiceMock.loginUser.and.returnValue(throwError(new Error()));
      const action = new LoginUser({userName: 'dummy', password: 'qwerty'});
      const completion = new LoginUserFail(new Error);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.logIn$).toBeObservable(expected);
    });
  });

});
