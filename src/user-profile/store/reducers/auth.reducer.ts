import { UserModel} from '../../models/user.model';
import { AuthActionTypes, UserProfileActions } from '../actions/user-profile.actions';
import {createFeatureSelector} from '@ngrx/store';
import * as fromAction from '../../../app/store/actions';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserModel | null;
  modal: {[id: string]: {isVisible?: boolean; countdown?: string}};
  loaded: boolean;
  loading: boolean;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  modal: {
    session: {
      isVisible: false,
      countdown: ''
    }
  },
  loaded: false,
  loading: false,

};

export function reducer(
  state = initialState,
  action: UserProfileActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.GET_USER_DETAILS_SUCCESS: {
      const user = new UserModel(action.payload);
      return {
        ...state,
        user,
        isAuthenticated: true,
        loaded: true,
        loading: false,
      };
    }

    case AuthActionTypes.SET_MODAL: {
      const modal = action.payload
      return {
        ...state,
        modal
      };
    }
  }
  return state;
}
export const getAuthState = createFeatureSelector<AuthState>('userProfile');

export const isAuthenticated = (state: AuthState) =>  state.isAuthenticated;
export const getUser = (state: AuthState) => state.user || null;
export const getModal = (state: AuthState) => state.user;
export const isUserLoaded = (state: AuthState) => state.loaded;
export const isUserLoading = (state: AuthState) => state.loading;
