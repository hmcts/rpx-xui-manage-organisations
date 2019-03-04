import {UserInterface, UserModel} from '../../models/user.model';
import { AuthActionTypes, AuthActions } from '../actions/auth.actions';
import {createFeatureSelector} from '@ngrx/store';


export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  Loaded: false,
  Loading: false,
  permissions: '',
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
      return {
        ...state,
        isAuthenticated: true,
        permissions: action.payload.data,
        errors: null
      };
    }

    case AuthActionTypes.USER_SUCCESS: {
      const user = new UserModel(action.payload);
      return {
        ...state,
        user,
        userDetailsLoaded: true,
        userDetailsLoading: false,
        errors: null
      };
    }

    case AuthActionTypes.LOGOUT: {
      return initialState;
    }
  }
  return state;
}
export const getAuthState = createFeatureSelector<AuthState>('auth');
export const isAuthenticated = (state: AuthState) =>  state.isAuthenticated;
export const getUser = (state: AuthState) => state.user;
export const isUserLoaded = (state: AuthState) => state.userDetailsLoaded;
export const isUserLoading = (state: AuthState) => state.userDetailsLoading;
export const isUserPermission = (state: AuthState) => state.permissions;
export const getErrorMessage = (state: AuthState) => state.errors;
