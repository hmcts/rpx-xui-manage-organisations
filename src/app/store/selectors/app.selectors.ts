import { createSelector } from '@ngrx/store';

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
    if (router && router.state) {
      return router.state.url.indexOf('register') !== -1 ? title.regOrg : title.manageOrg;
    }
  }
);

export const getNavItems = createSelector(
  getAppState,
  fromAppFeature.getNavItems
);

export const getUserNav = createSelector(
  getAppState,
  fromAppFeature.getUserNavigation
);
