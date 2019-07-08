import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as appActions from '../actions';
import {map} from 'rxjs/operators';

import * as usersActions from '../../../users/store/actions';
import * as fromUserProfile from '../../../user-profile/store';
import { CookieService } from 'ngx-cookie';
import config from '../../../../api/lib/config';
import {AuthGuard} from '../../../user-profile/guards/auth.guard';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private cookieService: CookieService,
    private authGard: AuthGuard
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
      window.location.href = 'api/logout';
    })
  );


}
