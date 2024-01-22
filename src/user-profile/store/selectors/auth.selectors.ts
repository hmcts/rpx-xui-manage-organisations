import { createSelector } from '@ngrx/store';
import { AppUtils } from 'src/app/utils/app-utils';
import * as fromApp from '../../../../src/app/store/index';
import * as fromRoot from '../reducers/';

export const authState = createSelector(
  fromRoot.getAuthState,
  (state: fromRoot.AuthState) => state
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

export const getIsUserCaaAdmin = createSelector(
  getUser,
  (user) => user.roles.includes('pui-caa')
);

export const getIsUserPuiFinanceManager = createSelector(
  getUser,
  (user) => user && user.roles ? user.roles.indexOf('pui-finance-manager') !== -1 : false
);

export const getUid = createSelector(
  getUser,
  (user) => {
    if (user) {
      // eslint-disable-next-line dot-notation
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

