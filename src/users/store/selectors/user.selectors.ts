import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromLogin from '../reducers/users.reducer';
import {debug} from 'util';

// export const getLoginState = createSelector(
//   fromFeature.getRootLoginState,
//   (state: fromFeature.LoginState) => {
//     debugger
//     return state.login
//   }
// );
//
// export const getGetUser = createSelector(
//   getLoginState,
//   fromLogin.getLoginFormUser
// );


