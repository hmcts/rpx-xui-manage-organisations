import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable} from 'rxjs';

// TODO MOVE THIS INTO THE EVIRONMENT FILE
export const ENVIRONMENT = {
  registerOrganisation: '/api/decisions/states/any/any/any/check'
};

/**
 * Registration Services
 * Responsible for communication between FE and BE only!
 */


@Injectable()
export class RegistrationFormService {
  constructor(private http: HttpClient) {}

  getRegistrationForm(pageId): Observable<any> { // TODO create type/model
    const url = `/api/decisions/states/any/any/any/${pageId}`;
    return this.http.get(url);
  }

  submitRegistrationForm(data: any): Observable<any> {
    const  postData = {
      fromValues: {...data},
      event: 'continue'
    };
    return this.http.post<any>(`${ENVIRONMENT.registerOrganisation}`, postData);
  }

}

