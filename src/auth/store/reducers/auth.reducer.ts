import { UserModel } from '../../models/user.model';
import { AuthActionTypes, AuthActions } from '../actions/auth.actions';


export interface AuthState {
  // is a user authenticated?
  isAuthenticated: boolean;
  // if authenticated, there should be a user object
  user: UserModel | null;
  // error messages
  errors: { [id: string]: string };
}

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
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
      const user = new UserModel(action.payload.user);
      // user.token = action.payload.token;
      return {
        ...state,
        isAuthenticated: true,
        user,
        errors: null
      };
    }
    // case AuthActionTypes.LOGIN_FAILURE:
    // case AuthActionTypes.FORGOT_PASSWORD_FAIL: {
    //   let errors = {};
    //   const message =  action.payload.error.json().message;
    //   if (action.type === AuthActionTypes.FORGOT_PASSWORD_FAIL) {
    //     errors = {
    //       ...state.errors,
    //       ['forgotPass']: message
    //     };
    //   } else {
    //     errors = {
    //       ...state.errors,
    //       ['login']: message
    //     };
    //   }
    //   return {
    //     ...state,
    //     errors
    //   };
    // }

    case AuthActionTypes.LOGOUT: {
      return initialState;
    }
  }
  return state;
}

export const isAuthenticated = (state: AuthState) =>  state.isAuthenticated;
export const getUser = (state: AuthState) => state.user;
export const getErrorMessage = (state: AuthState) => state.errors;
