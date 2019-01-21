import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as organisationActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrganisationFormService } from '../../services/organisation-form.service';

@Injectable()
export class OrganisationEffects {
  constructor(
    private actions$: Actions,
    private organisationService: OrganisationFormService
  ) { }

  @Effect()
  loadRegistrationForm$ = this.actions$.pipe(
    ofType(organisationActions.LOAD_REGISTRATION_FORM),
    switchMap(() => {
      return this.organisationService.getRetistrationFrom().pipe(
        map(regForm => new organisationActions.LoadRegistrationFormSuccsess(regForm)),
        catchError(error => of(new organisationActions.LoadRegistrationFormFail(error)))
      );
    })
  );
}
