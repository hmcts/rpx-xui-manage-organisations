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

export const getUid = createSelector(
  getUsers,
  (user) => {
    debugger
    if (user) {
      return user['userId']
    }
  }
);


export const userLoaded = createSelector(authState, fromRoot.isUserLoaded);
export const userLoading = createSelector(authState, fromRoot.isUserLoading);



