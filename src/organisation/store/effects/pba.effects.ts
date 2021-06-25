import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as fromRoot from '../../../app/store';
import { LoggerService } from '../../../shared/services/logger.service';
import { PBAService } from '../../services/pba.service';
import * as organisationActions from '../actions';

@Injectable()
export class PBAEffects {
  public payload: any;
  constructor(
    private readonly actions$: Actions,
    private readonly pbaService: PBAService,
    private readonly router: Router,
    private readonly loggerService: LoggerService
  ) { }

  @Effect()
  public updatePBAs$ = this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_PBAS),
    map((action: organisationActions.OrganisationUpdatePBAs) => action.payload),
    switchMap(payload => {
      this.payload = payload;
      return this.pbaService.updatePBAs(payload).pipe(
        map((response) => new organisationActions.OrganisationUpdatePBAResponse(response)),
        catchError(error => {
          const data = JSON.parse(error.error);
          if (data && data.request) {
            this.loggerService.error(data.request.errorMessage);
            return of(new organisationActions.OrganisationUpdatePBAError({
              status: error.status,
              message: data.request.errorMessage
            }));
          }
          return of(new fromRoot.Go({ path: ['/service-down']}));
        })
      );
    })
  );

  @Effect({ dispatch: false })
  public updatePBAsAndNavigate$ = this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_PBA_RESPONSE),
    tap((action) => this.router.navigate(['/organisation']))
  );
}
