import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as organisationActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrganisationService } from '../../services/organisation.service';
import { LoggerService } from 'src/shared/services/logger.service';

@Injectable()
export class OrganisationEffects {
  constructor(
    private actions$: Actions,
    private organisationService: OrganisationService,
    private loggerService: LoggerService
  ) { }

  @Effect()
  loadOrganisation$ = this.actions$.pipe(
    ofType(organisationActions.LOAD_ORGANISATION),
    switchMap(() => {
      this.loggerService.info('getting Organisations');
      return this.organisationService.fetchOrganisation().pipe(
        map(orgDetails => new organisationActions.LoadOrganisationSuccess(orgDetails)),
        catchError(error => of(new organisationActions.LoadOrganisationFail(error)))
      );
    })
  );
}
