import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromUsersEffects from './users.effects';
import { UsersEffects } from './users.effects';
import { LoadUsers, LoadUsersFail, LoadUsersSuccess } from '../actions/user.actions';

import { UsersService } from 'src/users/services';



describe('User Effects...', () => {
  let actions$;
  let effects: UsersEffects;
  const UsersServiceMock = jasmine.createSpyObj('UsersService', [
    'fetchUsers',
  ]);


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        fromUsersEffects.UsersEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(UsersEffects);

  });



  describe(' loadUsers$', () => {
    it('should return a collection from loadUsers$ - LoadUsersSuccess', () => {
      const payload = [{ payload: 'something' }];
      UsersServiceMock.fetchUsers.and.returnValue(of(payload));
      const action = new LoadUsers();
      const completion = new LoadUsersSuccess([{ payload: 'something' }]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadUsers$).toBeObservable(expected);
    });
  });


  describe('loadUser$ error', () => {
    it('should return LoadUsersFail', () => {
      UsersServiceMock.fetchUsers.and.returnValue(throwError(new Error()));
      const action = new LoadUsers();
      const completion = new LoadUsersFail(new Error);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadUsers$).toBeObservable(expected);
    });
  });

});