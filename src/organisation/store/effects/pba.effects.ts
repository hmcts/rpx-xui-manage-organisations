import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store';
import { LoggerService } from '../../../shared/services/logger.service';
import { ErrorMessage, OrgManagerConstants } from '../../organisation-constants';
import { PBAService } from '../../services/pba.service';
import { utils } from '../../utils';
import * as organisationActions from '../actions';

@Injectable()
export class PBAEffects {
  public payload: any;
  constructor(
    private readonly actions$: Actions,
    private readonly pbaService: PBAService,
    private readonly router: Router,
    private readonly loggerService: LoggerService
  ) {}

  public updatePBAs$ = createEffect(() => this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_PBAS),
    map((action: organisationActions.OrganisationUpdatePBAs) => action.payload),
    switchMap((payload) => {
      this.payload = payload;
      return this.pbaService.updatePBAs(payload).pipe(
        take(1),
        map((response) => new organisationActions.OrganisationUpdatePBAResponse(response)),
        catchError((e) => {
          if (e.error && e.error.length && (e.error[0])) {
            const error = JSON.parse(e.error[0]);
            if (error.request && error.request.reason && error.request.reason.duplicatePaymentAccounts.length) {
              const errorInstance = {
                pbaNumber: error.request.reason.duplicatePaymentAccounts[0],
                error: utils.getErrorDuplicateMessage(error.request.reason.duplicatePaymentAccounts[0]),
                headerError: utils.getErrorDuplicateHeaderMessage(error.request.reason.duplicatePaymentAccounts[0])
              } as ErrorMessage;
              return of(new organisationActions.OrganisationUpdatePBAError(errorInstance));
            } else if (error && error.request) {
              this.loggerService.error(error.request.errorMessage);
              return of(new organisationActions.OrganisationUpdatePBAError({
                status: e.status,
                message: error.request.errorMessage
              }));
            }
            const errorInstance = {
              headerError: OrgManagerConstants.PBA_SERVER_ERROR_MESSAGE
            } as ErrorMessage;
            return of(new organisationActions.OrganisationUpdatePBAError(errorInstance));
          }
          return of(new fromRoot.Go({ path: ['/service-down'] }));
        })
      );
    })
  ));

  public updatePBAsAndNavigate$ = createEffect(() => this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_PBA_RESPONSE),
    tap(() => this.router.navigate(['/organisation']))
  ), { dispatch: false });
}
