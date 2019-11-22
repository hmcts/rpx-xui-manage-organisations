import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TermsConditionsService } from 'src/shared/services/termsConditions.service';
import { JurisdictionService } from 'src/users/services';
import { AuthGuard } from '../../../user-profile/guards/auth.guard';
import * as fromUserProfile from '../../../user-profile/store';
import * as usersActions from '../../../users/store/actions';
import * as appActions from '../actions';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private jurisdictionService: JurisdictionService,
    private autGuard: AuthGuard,
    private readonly termsService: TermsConditionsService
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
        catchError(error => of(new appActions.LoadJurisdictionsFail(error)))
      );
    })
  );

  @Effect()
  loadTermsConditions$ = this.actions$.pipe(
    ofType(appActions.LOAD_TERMS_CONDITIONS),
    switchMap(() => {
      return this.termsService.getTermsConditions().pipe(
        map(doc => new appActions.LoadTermsConditionsSuccess(doc)),
        catchError(err => of(new appActions.LoadTermsConditionsFail(err)))
      );
    })
  );

}
