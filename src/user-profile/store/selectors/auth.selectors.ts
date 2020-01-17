import {createSelector} from '@ngrx/store';

import * as fromRoot from '../reducers/';
import {getAppState} from '../../../app/store/selectors';

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

export const getUserIdleTime = createSelector(
  getUsers,
  (user) => (user && user.idleTime) ? user.idleTime : NaN
);

export const getUserTimeOut = createSelector(
  getUsers,
  (user) => (user && user.timeout) ? user.timeout : NaN
);

export const getModalSessionData = createSelector(
  authState,
  (state) =>  state.modal ? state.modal.session : {}
);
// add missing tests


export const userLoaded = createSelector(authState, fromRoot.isUserLoaded);
export const userLoading = createSelector(authState, fromRoot.isUserLoading);



