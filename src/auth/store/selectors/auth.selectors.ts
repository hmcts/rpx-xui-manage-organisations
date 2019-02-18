import {createSelector} from '@ngrx/store';

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';

export const getAuthState = createSelector(
  fromRoot.getAuthState,
  (state: fromFeature.AuthState) =>  state
);

export const getIsAuthenticated = createSelector(
  getAuthState,
  fromFeature.isAuthenticated
);

