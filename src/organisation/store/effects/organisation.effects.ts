import { Injectable } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AppConstants } from '../../../app/app.constants';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import * as organisationActions from '../actions';
import { LoadOrganisationAccessTypes } from '../actions';
import { ApiError } from 'src/organisation/models/apiError.model';

@Injectable()
export class OrganisationEffects {
  public payload: any;
  constructor(
    private readonly actions$: Actions,
    private readonly organisationService: OrganisationService,
    private readonly loggerService: LoggerService,
    private readonly featureToggleService: FeatureToggleService
  ) {}

  public loadOrganisation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(organisationActions.LOAD_ORGANISATION),
      switchMap(() => {
        return this.featureToggleService.getValue(AppConstants.FEATURE_NAMES.newRegisterOrg, false);
      }),
      switchMap((newRegisterOrg) => {
        return this.organisationService.fetchOrganisation(newRegisterOrg).pipe(
          take(1),
          map((orgDetails) => new organisationActions.LoadOrganisationSuccess(orgDetails)),
          catchError((error) => {
            this.loggerService.error(error.message);
            return of(new organisationActions.LoadOrganisationFail(error));
          })
        );
      })
    )
  );

  public getAccessTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(organisationActions.LOAD_ORGANISATION_ACCESS_TYPES),
      switchMap((action: LoadOrganisationAccessTypes) => {
        return this.organisationService.retrieveAccessType(action.payload).pipe(
          map((jurisdictions) => new organisationActions.LoadOrganisationAccessTypesSuccess(jurisdictions.jurisdictions)),
          catchError((error) => {
            this.loggerService.error(error.message);
            return of(new organisationActions.LoadOrganisationAccessTypesFail(error));
          })
        );
      })
    )
  );

  public static getErrorAction(error: ApiError): Action {
    const errorCode = error.apiStatusCode;
    if (errorCode >= 500 && errorCode <= 599){
      return new organisationActions.LoadOrganisationAccessTypesFailWith5xx(error);
    }
    switch (error.apiStatusCode) {
      case 400:
        return new organisationActions.LoadOrganisationAccessTypesFailWith400(error);
      case 401:
        return new organisationActions.LoadOrganisationAccessTypesFailWith401(error);
      default:
        return new organisationActions.LoadOrganisationAccessTypesFail(error);
    }
  }
}
