import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

export const ENVIRONMENT = {
  orgUri: '/api/organisation'
};

@Injectable()
export class OrganisationService {
  constructor(private readonly http: HttpClient) { }

  public fetchOrganisation(): Observable<any> {
   return this.http.get<any>(`${ENVIRONMENT.orgUri}`);
  }
}
