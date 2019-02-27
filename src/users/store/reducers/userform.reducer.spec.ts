import * as fromUserform from './userform.reducer';
import * as fromActions from '../actions/userform.actions';


describe('UserformReducer', () => {






  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromUserform;
      const action = {} as any;
      const state = fromUserform.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });



  describe('SAVE_USER action', () => {
    it('should recieve form data upon click', () => {
      const { initialState } = fromUserform;

      const mockUser =
      {
        firstname: "user",
        lastname: "xxx",
        emailaddress: "email@gmail.com",
        permissions: ['a', 'b']
      }

      const action = new fromActions.SaveUser(mockUser);
      const state = fromUserform.reducer(initialState, action);

      expect(state.loaded).toEqual(false);
      expect(state.userList).toEqual(mockUser);
    });
  });




  describe('SAVE_USERS_FAIL action', () => {
    it('should return the previous state', () => {
      const { initialState } = fromUserform
      const previousState = { ...initialState, loading: true };
      const action = new fromActions.SaveUserFail({});
      const state = fromUserform.reducer(previousState, action);

      expect(state).toEqual(initialState);
    });
  });




  describe('SAVE_USERS_SUCCESS action', () => {
    it('should populate users from the array', () => {
      const mockUser =
      {
        firstname: "user",
        lastname: "xxx",
        emailaddress: "email@gmail.com",
        permissions: ['a', 'b']
      }

      const { initialState } = fromUserform
      const action = new fromActions.SaveUserSuccess(mockUser);
      const state = fromUserform.reducer(initialState, action);

      expect(state.loaded).toEqual(true);
      expect(state.loading).toEqual(false);
      expect(state.userList).toEqual(mockUser);
    });
  });


});
