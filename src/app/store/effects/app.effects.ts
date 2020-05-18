import {Inject, Injectable} from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { catchError, map, switchMap } from 'rxjs/operators';
import * as appActions from '../actions';

import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { combineLatest, Observable, of } from 'rxjs';
import { TermsConditionsService } from 'src/shared/services/termsConditions.service';
import {ENVIRONMENT_CONFIG, EnvironmentConfig} from '../../../models/environmentConfig.model';
import { LoggerService } from '../../../shared/services/logger.service';
import { AuthGuard } from '../../../user-profile/guards/auth.guard';
import * as fromUserProfile from '../../../user-profile/store';
import { JurisdictionService } from '../../../users/services';
import * as usersActions from '../../../users/store/actions';
import {IDLE_USER_SIGNOUT} from '../actions/app.actions';
import {AppFeatureFlag} from '../reducers/app.reducer';
@Injectable()
export class AppEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly jurisdictionService: JurisdictionService,
    private readonly autGuard: AuthGuard,
    private readonly termsService: TermsConditionsService,
    private readonly loggerService: LoggerService,
    private readonly featureToggleService: FeatureToggleService,
    @Inject(ENVIRONMENT_CONFIG) private readonly environmentConfig: EnvironmentConfig
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
      const redirectUrlEncoded = encodeURIComponent(this.autGuard.generateLoginUrl());
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
        catchError(err => of(new appActions.Go({ path: ['/service-down'] })))
      );
    })
  );

  @Effect()
  public featureToggleConfig = this.actions$.pipe(
    ofType(appActions.LOAD_FEATURE_TOGGLE_CONFIG),
    map((action: appActions.LoadFeatureToggleConfig) => action.payload),
    switchMap((featureNames: string[]) => {
      return combineLatest(this.getObservable(featureNames)).pipe(
        map(feature => this.getFeaturesPayload(feature, featureNames))
      );
    }
   )
  );

  /**
   * Note that this function is soon to be deprecated within the next two weeks, hence the lack of unit testing
   * around this.
   */
  @Effect()
  public idleSignout = this.actions$.pipe(
    ofType(appActions.IDLE_USER_SIGNOUT),

    // TODO: We need to make a call to the backend to logout, and then
    // re-direct the UI to idle-sign-out

    map(() => {

      const { hostname, port } = window.location;
      const portNumber = port ? `:${port}` : '';
      const baseUrl = `${this.environmentConfig.protocol}://${hostname}${portNumber}`;

      const idleSignOutUrl = `${baseUrl}/idle-sign-out`;
      window.location.href = `api/logout?redirect=${idleSignOutUrl}`;
    })
  );

  private getFeaturesPayload(features: boolean[], featureNames: string[]): appActions.LoadFeatureToggleConfigSuccess {
    const result: AppFeatureFlag[] = features.map((isEnabled, i) => {
      return {isEnabled, featureName: featureNames[i]};
    });
    return new appActions.LoadFeatureToggleConfigSuccess(result);
  }

  private getObservable(featureNames: string[]): Observable<boolean>[] {
    let observables = new Array<Observable<boolean>>();
    featureNames.forEach(featureName => {
      const observable = this.featureToggleService.isEnabled(featureName);
      observables = [...observables, observable];
    });
    return observables;
  }
}
