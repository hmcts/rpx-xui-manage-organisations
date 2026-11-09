import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, of, throwError } from 'rxjs';
import { JurisdictionResponse } from 'src/models';
import { OrganisationContactInformation } from '../../models/organisation.model';

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

  public updateName(): Observable<any> {
    return of(null);
    // TODO - Implement the actual update name logic when required
  }

  public updateSra(): Observable<any> {
    return of(null);
    // TODO - Implement the actual SRA ID update logic when required
  }

  public updateAddress(contactInformation: OrganisationContactInformation): Observable<any> {
    // Need to check the payload for non-empty fields before sending the update request
    const payload: Record<string, string> = {};
    const fields = ['addressLine1', 'addressLine2', 'addressLine3', 'townCity', 'county', 'country', 'postCode'] as const;
    for (const field of fields) {
      const value = contactInformation[field];
      if (value?.trim()) {
        payload[field] = value;
      }
    }
    const dxAddress = contactInformation.dxAddress[0];
    for (const field of ['dxNumber', 'dxExchange'] as const) {
      const value = dxAddress?.[field];
      if (value?.trim()) {
        payload[field] = value;
      }
    }

    return of(null);
    // TODO: Implement the actual update address logic when required - below a possible example
    //return this.http.put<any>(ENVIRONMENT.orgUri, { contactInformation: [contactInformation] });
  }

  public retrieveAccessType(organisationProfileIds: string[]): Observable<JurisdictionResponse> {
    return this.http
      .post<JurisdictionResponse>('/api/retrieve-access-types', { organisationProfileIds: organisationProfileIds })
      .pipe(catchError((error: any) => throwError(() => error.json())));
  }
}
