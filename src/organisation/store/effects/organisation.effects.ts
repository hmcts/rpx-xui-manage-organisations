import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import * as organisationActions from '../actions';

@Injectable()
export class OrganisationEffects {
  public payload: any;
  constructor(
    private readonly actions$: Actions,
    private readonly organisationService: OrganisationService,
    private readonly loggerService: LoggerService
  ) { }

  @Effect()
  public loadOrganisation$ = this.actions$.pipe(
    ofType(organisationActions.LOAD_ORGANISATION),
    switchMap(() => {
      return this.organisationService.fetchOrganisation().pipe(
        take(1),
        map(orgDetails => new organisationActions.LoadOrganisationSuccess(orgDetails)),
        catchError(error => {
          this.loggerService.error(error.message);
          return of(new organisationActions.LoadOrganisationFail(error));
        })
      );
    })
  );
}
