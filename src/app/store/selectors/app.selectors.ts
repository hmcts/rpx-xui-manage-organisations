import { createSelector } from '@ngrx/store';
import { AppConstants } from 'src/app/app.constants';

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

export const getFeeAndPayFeature = createSelector(
  getFeatureFlag,
  featureFlags => featureFlags && featureFlags.find(flag => flag.featureName === AppConstants.FEATURE_NAMES.feeAccount)
);

export const getFeeAndPayFeatureIsEnabled = createSelector(
  getFeeAndPayFeature,
  featureFlag => featureFlag && featureFlag.isEnabled
);

export const getUnassignedCasesFeature = createSelector(
  getFeatureFlag,
  featureFlags => featureFlags && featureFlags.find(flag => flag.featureName === AppConstants.FEATURE_NAMES.unassignedCases)
);

export const getUnassignedCasesFeatureIsEnabled = createSelector(
  getUnassignedCasesFeature,
  featureFlag => featureFlag && featureFlag.isEnabled
);

export const getEditUserFeature = createSelector(
  getFeatureFlag,
  featureFlags => featureFlags && featureFlags.find(flag => flag.featureName === AppConstants.FEATURE_NAMES.editUserPermissions)
);

export const getEditUserFeatureIsEnabled = createSelector(
  getEditUserFeature,
  featureFlag => featureFlag && featureFlag.isEnabled
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

export const getCurrentError = createSelector(
  getAppState,
  fromAppFeature.getGlobalError
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

export const getModalSessionData = createSelector(
  getAppState,
  (state) => state.modal.session
);
