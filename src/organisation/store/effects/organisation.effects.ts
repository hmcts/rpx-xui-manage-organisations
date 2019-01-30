import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as organisationActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrganisationService } from '../../services/organisation.service';

@Injectable()
export class OrganisationEffects {
  constructor(
    private actions$: Actions,
    private organisationService: OrganisationService
  ) { }

  @Effect()
  loadOrganisation$ = this.actions$.pipe(
    ofType(organisationActions.LOAD_ORGANISATION),
    switchMap(() => {
      return this.organisationService.fetchOrganisation().pipe(
        map(orgDetails => new organisationActions.LoadOrganisationSuccess(orgDetails)),
        catchError(error => of(new organisationActions.LoadOrganisationFail(error)))
      );
    })
  );
}
