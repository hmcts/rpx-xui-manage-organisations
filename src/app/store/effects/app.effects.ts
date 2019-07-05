import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as appActions from '../actions';
import {map} from 'rxjs/operators';

import * as usersActions from '../../../users/store/actions';
import * as fromUserProfile from '../../../user-profile/store';
import { CookieService } from 'ngx-cookie';
import config from '../../../../api/lib/config';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private cookieService: CookieService
  ) {}

  @Effect()
  updateTitle$ = this.actions$.pipe(
    ofType(usersActions.UPDATE_ERROR_MESSAGES),
    map(() => {
      return new appActions.SetPageTitleErrors();
    })
  );

  @Effect()
  setUserRoles$ = this.actions$.pipe(
    ofType(fromUserProfile.AuthActionTypes.GET_USER_DETAILS_SUCCESS),
    map((actions: fromUserProfile.GetUserDetailsSuccess) => actions.payload.roles),
    map((roles) => {
      return new appActions.SetUserRoles(roles);
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType(appActions.LOGOUT),
    map(() => {
      // let API_BASE_URL = window.location.protocol + '//' + window.location.hostname;
      // API_BASE_URL += window.location.port ? ':' + window.location.port : '';
      // const base = config.services.idamWeb;
      // const clientId = config.idamClient;
      // const callback = `${API_BASE_URL}${config.oauthCallbackUrl}`;
      // window.location.href = `${base}?response_type=code&client_id=${clientId}&redirect_uri=${callback}`;
    })
  );


}
