import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';


const dummy = [{
  name: 'xyz solicitors Ltd',
  address1: '10 Oxford Street',
  town: 'London',
  postcode: 'W1 ABC',

}]




@Injectable()
export class OrganisationService {
  constructor(private http: HttpClient) { }

  fetchOrganisation(): Observable<any> {
    return of(dummy)
    // return this.http
    //   .get<any>(`/api/pizzas`)
    //   .pipe(catchError((error: any) => throwError(error.json())));
  }


}
