import {createSelector} from '@ngrx/store';

import * as fromRoot from '../reducers/';

export const authState = createSelector(
  fromRoot.getAuthState,
  (state: fromRoot.AuthState) =>  state
);

export const getIsAuthenticated = createSelector(
  authState,
  fromRoot.isAuthenticated
);

export const getUsers = createSelector(
  authState,
  fromRoot.getUser
);

export const getUserTimeOut = createSelector(
  getUsers,
  (user) => (user && user.sessionTimeOut) ? user.sessionTimeOut : NaN
);

export const getSessionTimeOut = createSelector(
  getUsers,
  (user) => (user && user.sessionTimeStamp) ? user.sessionTimeStamp : NaN
);

export const userLoaded = createSelector(authState, fromRoot.isUserLoaded);



