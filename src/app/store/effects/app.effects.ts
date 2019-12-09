import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as appActions from '../actions';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as usersActions from '../../../users/store/actions';
import * as fromUserProfile from '../../../user-profile/store';
import { JurisdictionService } from 'src/users/services';
import { of } from 'rxjs';
import { AuthGuard } from '../../../user-profile/guards/auth.guard';
import {SignedOut} from '../actions';
import {LogOutService} from '../../../shared/services/logOutService.service';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private jurisdictionService: JurisdictionService,
    private authGuard: AuthGuard,
    private logOutService: LogOutService
  ) { }

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
      const redirectUrl = this.authGuard.generateLoginUrl();
      const redirectUrlEncoded = encodeURIComponent(redirectUrl);
      window.location.href = `api/logout?redirect=${redirectUrlEncoded}`;
    })
  );

  @Effect()
  signedOut = this.actions$.pipe(
    ofType(appActions.SIGNED_OUT),
    switchMap(() => {
      return this.logOutService.logOut().pipe(
        map(() => new appActions.SignedOutSuccess())
      );
    })
  );

  @Effect()
  loadJurisdictions$ = this.actions$.pipe(
    ofType(appActions.LOAD_JURISDICTIONS_GLOBAL),
    switchMap(() => {
      return this.jurisdictionService.getJurisdictions().pipe(
        map(jurisdictions => new appActions.LoadJurisdictionsSuccess(jurisdictions)),
        catchError(error => of(new appActions.LoadJurisdictionsFail(error)))
      );
    })
  );

}
