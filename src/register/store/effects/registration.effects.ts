import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as registrationActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {RegistrationFormService} from '../../services/registration-form.service';

@Injectable()
export class RegistrationEffects {
  constructor(
    private actions$: Actions,
    private registrationService: RegistrationFormService
  ) {}

  @Effect()
  loadRegistrationForm$ = this.actions$.pipe(
    ofType(registrationActions.LOAD_REGISTRATION_FORM),
    switchMap(() => {
      return this.registrationService.getRetistrationFrom().pipe(
        map(regForm => new registrationActions.LoadRegistrationFormSuccsess(regForm)),
        catchError(error => of(new registrationActions.LoadRegistrationFormFail(error)))
      );
    })
  );
}
