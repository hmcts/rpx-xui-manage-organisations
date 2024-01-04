import { Injectable } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AppConstants } from '../../../app/app.constants';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import * as organisationActions from '../actions';

@Injectable()
export class OrganisationEffects {
  public payload: any;
  constructor(
    private readonly actions$: Actions,
    private readonly organisationService: OrganisationService,
    private readonly loggerService: LoggerService,
    private readonly featureToggleService: FeatureToggleService
  ) {}

  @Effect()
  public loadOrganisation$ = this.actions$.pipe(
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
    );
}
