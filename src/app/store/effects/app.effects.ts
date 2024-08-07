import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, switchMap } from 'rxjs/operators';
import * as appActions from '../actions';

import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { combineLatest, Observable, of } from 'rxjs';
import { TermsConditionsService } from 'src/shared/services/termsConditions.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { AuthService } from '../../../user-profile/services/auth.service';
import * as fromUserProfile from '../../../user-profile/store';
import { JurisdictionService } from '../../../users/services';
import * as usersActions from '../../../users/store/actions';
import { AppFeatureFlag } from '../reducers/app.reducer';

@Injectable()
export class AppEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly jurisdictionService: JurisdictionService,
    private readonly authService: AuthService,
    private readonly termsService: TermsConditionsService,
    private readonly loggerService: LoggerService,
    private readonly featureToggleService: FeatureToggleService
  ) {}

  public updateTitle$ = createEffect(() => this.actions$.pipe(
    ofType(usersActions.UPDATE_ERROR_MESSAGES),
    map(() => {
      return new appActions.SetPageTitleErrors();
    })
  ));

  public setUserRoles$ = createEffect(() => this.actions$.pipe(
    ofType(fromUserProfile.AuthActionTypes.GET_USER_DETAILS_SUCCESS),
    map((actions: fromUserProfile.GetUserDetailsSuccess) => actions.payload.roles),
    map((roles) => {
      return new appActions.SetUserRoles(roles);
    })
  ));

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.LOGOUT),
    map(() => {
      this.authService.signOut();
    })
  ), { dispatch: false });

  public loadJuridictions$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.LOAD_JURISDICTIONS_GLOBAL),
    switchMap(() => {
      return this.jurisdictionService.getJurisdictions().pipe(
        map((jurisdictions) => new appActions.LoadJurisdictionsSuccess(jurisdictions)),
        catchError((error) => {
          this.loggerService.error(error.message);
          return of(new appActions.LoadJurisdictionsFail(error));
        })
      );
    })
  ));

  public loadTermsConditions$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.LOAD_TERMS_CONDITIONS),
    switchMap(() => {
      return this.termsService.getTermsConditions().pipe(
        map((doc) => new appActions.LoadTermsConditionsSuccess(doc)),
        catchError(() => of(new appActions.Go({ path: ['/service-down'] })))
      );
    })
  ));

  public featureToggleConfig = createEffect(() => this.actions$.pipe(
    ofType(appActions.LOAD_FEATURE_TOGGLE_CONFIG),
    map((action: appActions.LoadFeatureToggleConfig) => action.payload),
    switchMap((featureNames: string[]) => {
      return combineLatest(this.getObservable(featureNames)).pipe(
        map((feature) => this.getFeaturesPayload(feature, featureNames))
      );
    }
    )
  ));

  /**
   * Note that this function is soon to be deprecated within the next two weeks, hence the lack of unit testing
   * around this.
   */

  public idleSignout = createEffect(() => this.actions$.pipe(
    ofType(appActions.IDLE_USER_SIGNOUT),
    map(() => {
      this.authService.logOutAndRedirect();
    })
  ), { dispatch: false });

  public getFeaturesPayload(features: boolean[], featureNames: string[]): appActions.LoadFeatureToggleConfigSuccess {
    const result: AppFeatureFlag[] = features.map((isEnabled, i) => {
      return { isEnabled, featureName: featureNames[i] };
    });
    return new appActions.LoadFeatureToggleConfigSuccess(result);
  }

  public getObservable(featureNames: string[]): Observable<boolean>[] {
    let observables = new Array<Observable<boolean>>();
    featureNames.forEach((featureName) => {
      const observable = this.featureToggleService.isEnabled(featureName);
      observables = [...observables, observable];
    });
    return observables;
  }
}
