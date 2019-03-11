import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export const ENVIRONMENT = {

  orgUri: '/api/organisation'
}



@Injectable()
export class OrganisationService {
  constructor(private http: HttpClient) { }

  // TO DO  - this hard coded orgId needs to come from the userStore
  orgId = 'b4775ea1-4036-4d7b-bebd-0b7cdc3c786f'


  mockOrgData = {
    name: 'WP',
    houseNoBuildingName: 'Test house',
    addressLine1: '10 Oxford St',
    addressLine2: '',
    townCity: 'London',
    postcode: 'W1',
    country: 'UK'
  }


  fetchOrganisation(): Observable<any> {

    // ** TO DO ** when TABBY fixes ENDPOINT

    // return this.http.get<any>(`${ENVIRONMENT.orgUri}/${this.orgId}`)
    //   .pipe(
    //     map(data => {
    //       // do transformations

    //       let addressObj = JSON.parse(data.addresses[0].address)
    //       let newOrgData =
    //       {
    //         name: data.name,
    //         houseNoBuildingName: addressObj.houseNoBuildingName || 'a',
    //         addressLine1: addressObj.addressLine1 || 'a',
    //         addressLine2: addressObj.addressLine2 || 'a',
    //         townCity: addressObj.townCity || 'a',
    //         postcode: addressObj.postcode || 'a',
    //         country: addressObj.country || 'a'
    //       }
    //       return newOrgData
    //     }),
    //     catchError(this.handleError)
    //   );

    return of(this.mockOrgData)
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
        `body was:`, error.error);
    }
    // return an observable with a user-facing error message
    return throwError(
      'error please try again later.');
  };
}
