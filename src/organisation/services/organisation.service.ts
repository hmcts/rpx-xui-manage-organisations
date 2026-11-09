import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, of, throwError } from 'rxjs';
import { JurisdictionResponse } from 'src/models';

export const ENVIRONMENT = {
  orgUri: '/api/organisation'
};

@Injectable()
export class OrganisationService {
  constructor(private readonly http: HttpClient) { }

  public fetchOrganisationLatest(): Observable<any> {
    return this.http.get<any>(ENVIRONMENT.orgUri);
  }

  public fetchOrganisationV1(): Observable<any> {
    return this.http.get<any>(`${ENVIRONMENT.orgUri}/v1`);
  }

  public updateAddress(): Observable<any> {
    return of(null);
    // TODO: Implement the actual update address logic when required - below a possible example
    //return this.http.put<any>(ENVIRONMENT.orgUri, { contactInformation: [contactInformation] });
  }

  public updateName(): Observable<any> {
    return of(null);
    // TODO - Implement the actual update name logic when required
  }

  public updateSra(): Observable<any> {
    return of(null);
    // TODO - Implement the actual SRA ID update logic when required
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was:', error.error);
    }
    // return an observable with a user-facing error message
    return throwError(() => 'error please try again later.');
  }

  public retrieveAccessType(organisationProfileIds: string[]): Observable<JurisdictionResponse> {
    return this.http
      .post<JurisdictionResponse>('/api/retrieve-access-types', { organisationProfileIds: organisationProfileIds })
      .pipe(catchError((error: any) => throwError(() => error.json())));
  }
}
