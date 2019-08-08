import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as registrationActions from '../actions';
import * as fromRoot from '../../../app/store';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {RegistrationFormService} from '../../services/registration-form.service';
import { LoggerService } from 'src/shared/services/logger.service';


@Injectable()
export class RegistrationEffects {
  constructor(
    private actions$: Actions,
    private registrationService: RegistrationFormService,
    private loggerService: LoggerService
  ) {}

  @Effect()
  loadRegistrationForm$ = this.actions$.pipe(
    ofType(registrationActions.LOAD_PAGE_ITEMS),
    map((action: registrationActions.LoadPageItems) => action.payload),
    switchMap((pageId) => {
      return this.registrationService.getRegistrationForm(pageId).pipe(
        map(returnedItems => {

          return new registrationActions.LoadPageItemsSuccess({payload: returnedItems, pageId});

        }),
        catchError(error => of(new registrationActions.LoadPageItemsSuccess(error)))
      );
    })
  );

  @Effect()
  postRegistrationFormData$ = this.actions$.pipe(
    ofType(registrationActions.SUBMIT_FORM_DATA),
    map((action: registrationActions.SubmitFormData) => action.payload),
    switchMap((formValues) => {
      return this.registrationService.submitRegistrationForm(formValues).pipe(
        map(obj => {
          debugger;
          this.loggerService.log('Registation Submitted Successfully')
          return new registrationActions.SubmitFormDataSuccess();
        }),
        catchError(error => {
          debugger;
          //return of(new registrationActions.SubmitFormDataFail(error))
        })
    );
    })
  );


}
