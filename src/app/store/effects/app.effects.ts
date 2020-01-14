import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { catchError, map, switchMap } from 'rxjs/operators';
import * as appActions from '../actions';

import { of } from 'rxjs';
import { TermsConditionsService } from 'src/shared/services/termsConditions.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { AuthGuard } from '../../../user-profile/guards/auth.guard';
import * as fromUserProfile from '../../../user-profile/store';
import { JurisdictionService } from '../../../users/services';
import * as usersActions from '../../../users/store/actions';

@Injectable()
export class AppEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly jurisdictionService: JurisdictionService,
    private readonly autGuard: AuthGuard,
    private readonly termsService: TermsConditionsService,
    private readonly loggerService: LoggerService
  ) { }

  @Effect()
  public updateTitle$ = this.actions$.pipe(
    ofType(usersActions.UPDATE_ERROR_MESSAGES),
    map(() => {
      return new appActions.SetPageTitleErrors();
    })
  );

  @Effect()
  public setUserRoles$ = this.actions$.pipe(
    ofType(fromUserProfile.AuthActionTypes.GET_USER_DETAILS_SUCCESS),
    map((actions: fromUserProfile.GetUserDetailsSuccess) => actions.payload.roles),
    map((roles) => {
      return new appActions.SetUserRoles(roles);
    })
  );

  @Effect({ dispatch: false })
  public logout$ = this.actions$.pipe(
    ofType(appActions.LOGOUT),
    map(() => {
      const redirectUrl = this.autGuard.generateLoginUrl();
      const redirectUrlEncoded = encodeURIComponent(redirectUrl);
      window.location.href = `api/logout?redirect=${redirectUrlEncoded}`;
    })
  );

  @Effect()
  public loadJuridictions$ = this.actions$.pipe(
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
  public loadTermsConditions$ = this.actions$.pipe(
    ofType(appActions.LOAD_TERMS_CONDITIONS),
    switchMap(() => {
      return this.termsService.getTermsConditions().pipe(
        map(doc => new appActions.LoadTermsConditionsSuccess(doc)),
        catchError(err => of(new appActions.LoadTermsConditionsFail(err)))
      );
    })
  );

}
