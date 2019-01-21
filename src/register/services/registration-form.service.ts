import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of} from 'rxjs';


const dummy = {
  idPrefix: 'final-decision',
  name: 'final-decision',
  header: 'Make final decision',
  formGroupValidators: [],
  validationHeaderErrorMessages: [
    {
      validationLevel: 'formControl',
      controlId: 'decisionNotes',
      text: 'Enter your decision notes',
      href: '#'
    }
  ],
  groups: [
    {
      textarea: {
        label: {
          text: 'Enter decision notes',
          classes: 'govuk-label--m'
        },
        validationError: {
          value: 'Enter your decision notes',
          controlId: 'decisionNotes'
        },
        control: 'decisionNotes',
        value: '',
        validators: ['required']
      }
    },
    {
      button: {
        control: 'createButton',
        value: 'Continue',
        type: 'submit',
        classes: '',
        onEvent: 'continue'
      }
    }
  ]
}


@Injectable()
export class RegistrationFormService {
  constructor(private http: HttpClient) {}

  getRetistrationFrom(): Observable<any> {
    return of(dummy)
    // return this.http
    //   .get<any>(`/api/pizzas`)
    //   .pipe(catchError((error: any) => throwError(error.json())));
  }


}
