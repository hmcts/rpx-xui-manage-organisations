import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {RegistrationConstants} from '../constants/registration.constants';

// TODO MOVE THIS INTO THE ENVIRONMENT FILE
export const ENVIRONMENT = {
  registerOrganisation: '/external/register-org/register'
};
/**
 * Registration Services
 * Responsible for communication between FE and BE only!
 */

@Injectable()
export class RegistrationFormService {
  constructor(private http: HttpClient) {}

  getRegistrationForm(pageId): Observable<any> { // TODO create type/model
    return of(RegistrationConstants.FORM_BUILDER_TEMPLATES[pageId]);
  }

  submitRegistrationForm(data: any): Observable<any> {
    const  postData = {
      fromValues: {...data},
      event: 'continue'
    };
    return this.http.post<any>(`${ENVIRONMENT.registerOrganisation}`, postData);
  }

}

