import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromLogin from '../../store/reducers/login.reducer';
import {debug} from 'util';

export const getLoginState = createSelector(
  fromFeature.getRootLoginState,
  (state: fromFeature.LoginState) => state.login
);

export const getLoggedInUser = createSelector(
  getLoginState,
  fromLogin.getLoggedInUserData
);


