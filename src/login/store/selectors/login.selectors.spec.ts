import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { LoginState } from '../reducers/login.reducer';
import { getLoggedInUser, getLoginState } from './login.selectors';
import { reducers } from '../index';
import { LoginUserSuccess } from '../actions';

describe('Login selectors', () => {
  let store: Store<LoginState>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('login', reducers),
      ],
    });
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getLoginState', () => {
    it('should return login state', () => {
      let result;
      store.pipe(select(getLoginState)).subscribe(value => {
        result = value;

      });
      expect(result).toEqual({ user: null, loaded: false, loading: false });
    });
  });


  describe('getLoggedInUser', () => {
    it('should return logged in user', () => {
      let result;
      store.pipe(select(getLoggedInUser)).subscribe(value => {
        result = value;

      });
      expect(result).toEqual(null);
      store.dispatch(new LoginUserSuccess({
        firstname: 'John',
        lastname: 'Smith',
        email: 'duda@dudee.com',
        password: 'qwerty',
        permission: 'superuser'
      }));
      expect(result).toEqual({
        firstname: 'John',
        lastname: 'Smith',
        email: 'duda@dudee.com',
        password: 'qwerty',
        permission: 'superuser'
      });
    });
  });

});
