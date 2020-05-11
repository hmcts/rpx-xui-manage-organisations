import {createSelector} from '@ngrx/store';
import * as fromApp from '../../../../src/app/store/index';
import * as fromRoot from '../reducers/';
import { AppUtils } from 'src/app/utils/app-utils';
import {AuthState} from '../reducers';

export const authState = createSelector(
  fromRoot.getAuthState,
  (state: fromRoot.AuthState) =>  state
);

export const getIsAuthenticated = createSelector(
  authState,
  fromRoot.isAuthenticated
);

export const getShowHeaderItems = createSelector(
  fromApp.getRouterState,
  getIsAuthenticated,
  (router, isAuth) => {
    return AppUtils.showSubHeaderItems(isAuth, router);
  }
);

export const getUser = createSelector(
  authState,
  fromRoot.getUserConfig
);

export const getUid = createSelector(
  getUser,
  (user) => {
    if (user) {
      return user['userId'];
    }
  }
);

export const userLoaded = createSelector(
  authState,
  fromRoot.isUserLoaded
);

export const getHasUserSelectedTC = createSelector(
  authState,
  fromRoot.gethasUserAcceptedTC
);



