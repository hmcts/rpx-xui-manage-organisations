import { createSelector } from '@ngrx/store';
import {AppUtils} from '../../utils/app-utils';
import * as fromRoot from '../reducers';
import * as fromAppFeature from '../reducers/app.reducer';


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

export const getFeatureFlag = createSelector(
  getAppState,
  state => state.featureFlags
);

export const getFeatureEnabledNav = createSelector(
  getNav,
  getFeatureFlag,
  (navItems, featureFlags) => {
    return AppUtils.getFeatureEnabledNavItems(navItems, featureFlags);
  }
);

export const getAllJurisdictions = createSelector(
  getAppState,
  fromAppFeature.getUserJuridictions
);

export const getNavItems = createSelector(
  getFeatureEnabledNav,
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

export const getTermsAndConditions = createSelector(
  getAppState,
  state => state.termsAndConditions
);
