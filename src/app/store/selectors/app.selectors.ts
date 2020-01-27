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
    return AppUtils.titleSwitcher(router, title);
  }
);

export const getNav = createSelector(
  getAppState,
  fromAppFeature.getNavItems
);

export const getAllJuridictions = createSelector(
  getAppState,
  fromAppFeature.getUserJuridictions
);

export const getNavItems = createSelector(
  getNav,
  fromRoot.getRouterState,
  (navItems, router) => {
    // set the active state based on routes
    const nav = AppUtils.setActiveLink(navItems, router);
    // do not set nav items for register org
    return AppUtils.returnNavs(router, nav);
  }
);

export const getUserNav = createSelector(
  getAppState,
  fromRoot.getRouterState,
  (state, routes) => {
    return AppUtils.setSetUserNavItems(state, routes);
  }
);
