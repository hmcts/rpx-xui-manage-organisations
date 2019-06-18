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

export const getPageTitles = createSelector(
  getAppState,
  fromAppFeature.getAppTitles
);

export const getNavItems = createSelector(
  getAppState,
  fromAppFeature.getNavItems
);

export const getUserNav = createSelector(
  getAppState,
  fromAppFeature.getUserNavigation
);
