import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as registrationActions from '../actions';
import * as fromRoot from '../../../app/store';
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
          return new registrationActions.SubmitFormDataSuccess();
        }),
        catchError(error => of(new registrationActions.SubmitFormDataFail(error)))
    );
    })
  );

  @Effect()
  saveFormData$ = this.actions$.pipe(
    ofType(registrationActions.SAVE_FORM_DATA),
    map((action: registrationActions.SaveFormData) => action.payload),
    switchMap((formValues) =>  {
      debugger;
      const nextUrl = formValues.value['have'] === 'dontHave' ?
        formValues.value['dontHave'] : formValues.nextUrl;
      return [
          new fromRoot.Go({
            path: ['/register-org/register', nextUrl]
          })];
      }
    )
  );

}
