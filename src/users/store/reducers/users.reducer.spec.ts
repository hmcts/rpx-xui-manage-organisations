import * as fromUsers from './users.reducer';
import * as fromActions from '../actions/user.actions';


fdescribe('UsersReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromUsers;
      const action = {};
      const state = fromUsers.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });


  // I nest all tests under the reducer's name 
  // for readability in the terminal

  fdescribe('LOAD_USERS action', () => {
    it('should set loading to true', () => {
      const { initialState } = fromUsers;
      const action = new fromActions.LoadUsers();
      const state = fromUsers.reducer(initialState, action);

      expect(state.loading).toEqual(true);
      // untouched props, good to add regardless
      expect(state.loaded).toEqual(false);
      expect(state.users).toEqual([]);
    });
  });



  // fail
  fdescribe('LOAD_USERS action', () => {
    it('should return the previous state', () => {
      const { initialState } = fromUsers
      const previousState = { ...initialState, loading: true };
      const action = new fromActions.LoadUsersFail({});
      const state = fromUsers.reducer(previousState, action);

      expect(state).toEqual(initialState);
    });
  });



  // success
  fdescribe('LOAD_USERS_SUCCESS action', () => {
    it('should populate users from the array', () => {
      const users: any[] = [
        { id: 1, name: 'bob' },
        { id: 2, name: 'fred' },
      ];

      const { initialState } = fromUsers;
      const action = new fromActions.LoadUsersSuccess(users);
      const state = fromUsers.reducer(initialState, action);

      expect(state.loaded).toEqual(true);
      expect(state.loading).toEqual(false);
      expect(state.users).toEqual(users);
    });
  });


});