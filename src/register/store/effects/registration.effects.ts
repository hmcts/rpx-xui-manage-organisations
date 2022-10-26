import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import { LoggerService } from '../../../shared/services/logger.service';
import {RegistrationFormService} from '../../services/registration-form.service';
import * as registrationActions from '../actions';


@Injectable()
export class RegistrationEffects {
  constructor(
    private actions$: Actions,
    private registrationService: RegistrationFormService,
    private loggerService: LoggerService
  ) {}

  @Effect()
  public loadRegistrationForm$ = this.actions$.pipe(
    ofType(registrationActions.LOAD_PAGE_ITEMS),
    map((action: registrationActions.LoadPageItems) => action.payload),
    switchMap((pageId) => {
      return this.registrationService.getRegistrationForm(pageId).pipe(
        map(returnedItems => {
          return new registrationActions.LoadPageItemsSuccess({payload: returnedItems, pageId});

        }),
        catchError(error => {
          this.loggerService.error(error.message);
          return of(new registrationActions.LoadPageItemsFail(error));
        })
      );
    })
  );

  @Effect()
  public postRegistrationFormData$ = this.actions$.pipe(
    ofType(registrationActions.SUBMIT_FORM_DATA),
    map((action: registrationActions.SubmitFormData) => action.payload),
    switchMap((formValues) => {
      return this.registrationService.submitRegistrationForm(formValues).pipe(
        map(obj => {
          return new registrationActions.SubmitFormDataSuccess();
        }),
        catchError(error => {
          this.loggerService.error(error.message);
          return of(new registrationActions.SubmitFormDataFail(error));
        })
    );
    })
  );


}
