import { createSelector } from '@ngrx/store';

import * as fromRoot from '../reducers';
import * as fromAppFeature from '../reducers/app.reducer';
import {AppUtils} from '../../utils/app-utils';


export const getAppState = createSelector(
  fromRoot.getRootAppState,
  (state: fromAppFeature.AppState) => state
);

export const getPageTitle = createSelector(
  getAppState,
  fromAppFeature.getPageTitle
);

export const getHeaderTitles = createSelector(
  getAppState,
  fromAppFeature.getHeaderTitles
);

export const getHeaderTitle = createSelector(
  getHeaderTitles,
  fromRoot.getRouterState,
  (title, router) => {
    if (router && router.state) {
      return router.state.url.indexOf('register') !== -1 ? title.regOrg : title.manageOrg;
    }
  }
);

export const getNav = createSelector(
  getAppState,
  fromAppFeature.getNavItems
);

export const getNavItems = createSelector(
  getNav,
  fromRoot.getRouterState,
  (navItems, router) => {
    // set the active state based on routes
    const nav = AppUtils.setActiveLink(navItems, router);
    // do not set nav items for register org
    if (router && router.state && router.state.url.indexOf('register') === -1) {
      return {
        navItems: nav
      };
    } else {
      return {
        navItems: []
      };
    }

  }
);

export const getUserNav = createSelector(
  getAppState,
  fromRoot.getRouterState,
  (state, routes) => {
    if (state && state.userNav && routes && routes.state.url) {
      const isRegister = routes.state.url.indexOf('register') === -1;
      return isRegister ? state.userNav : [];
    }
    return [];
  }

);
