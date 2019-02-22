import { UserModel } from '../../models/user.model';
import { AuthActionTypes, AuthActions } from '../actions/auth.actions';


export interface AuthState {
  // is a user authenticated?
  isAuthenticated: boolean;
  // if authenticated, there should be a user object
  user: UserModel | [{}];
  // error messages
  errors: { [id: string]: string };
}

export const initialState: AuthState = {
  isAuthenticated: false,
  user: [],
  errors: {
    forgotPass: '',
    login: ''
  },
};

export function reducer (
  state = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {
      const user = new UserModel(action.payload);
      // user.token = action.payload.token;
      return {
        ...state,
        isAuthenticated: true,
        user,
        errors: null
      };
    }

    case AuthActionTypes.LOGOUT: {
      return initialState;
    }
  }
  return state;
}

export const isAuthenticated = (state: AuthState) =>  state.isAuthenticated;
export const getUser = (state: AuthState) => state.user;
export const getErrorMessage = (state: AuthState) => state.errors;
