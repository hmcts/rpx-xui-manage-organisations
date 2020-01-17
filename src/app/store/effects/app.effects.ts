import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as appActions from '../actions';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as usersActions from '../../../users/store/actions';
import * as fromUserProfile from '../../../user-profile/store';
import { JurisdictionService } from '../../../users/services';
import { of } from 'rxjs';
import { AuthGuard } from '../../../user-profile/guards/auth.guard';
import { LoggerService } from '../../../shared/services/logger.service';
import { LogOutKeepAliveService } from '../../../shared/services/keep-alive/keep-alive.services';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private jurisdictionService: JurisdictionService,
    private autGuard: AuthGuard,
    private loggerService: LoggerService,
    private logOutService: LogOutKeepAliveService,
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
      const redirectUrl = this.autGuard.generateLoginUrl();
      const redirectUrlEncoded = encodeURIComponent(redirectUrl);
      window.location.href = `api/logout?redirect=${redirectUrlEncoded}`;
    })
  );

  @Effect()
  loadJuridictions$ = this.actions$.pipe(
    ofType(appActions.LOAD_JURISDICTIONS_GLOBAL),
    switchMap(() => {
      return this.jurisdictionService.getJurisdictions().pipe(
        map(jurisdictions => new appActions.LoadJurisdictionsSuccess(jurisdictions)),
        catchError(error => {
          this.loggerService.error(error.message);
          return of(new appActions.LoadJurisdictionsFail(error));
        })
      );
    })
  );

  @Effect()
  sigout$ = this.actions$.pipe(
    ofType(appActions.SIGNED_OUT),
    switchMap(() => {
      return this.logOutService.logOut().pipe(
        map(() => new appActions.SignedOutSuccess())
      );
    })
  );

  @Effect()
  signedOutSuccess$ = this.actions$.pipe(
    ofType(appActions.SIGNED_OUT_SUCCESS),
    map(() => new appActions.Go({path: ['/signed-out']}))
  );

  @Effect({ dispatch: false})
  keepAlive$ = this.actions$.pipe(
    ofType(appActions.KEEP_ALIVE),
    switchMap((date) => {
      return this.logOutService.heartBeat()
        ;
    })
  );

}
