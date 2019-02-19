import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Using health to check that outbound http calls from this application
 * to the Node layer work.
 */
export const ENVIRONMENT = {
  health: '/api/organisation/address'
}



@Injectable()
export class OrganisationService {
  constructor(private http: HttpClient) { }

  fetchOrganisation(): Observable<any> {
    console.log('fetch organisation xxx')
    return this.http.get<any>(`${ENVIRONMENT.health}`)
      .pipe(
        catchError(this.handleError)
      );
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
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}