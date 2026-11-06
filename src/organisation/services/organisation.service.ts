import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';
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

  public updateAddress(contactInformation: OrganisationContactInformation): Observable<void> {
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
    return this.http.put<void>(`${ENVIRONMENT.orgUri}/contact-information`, payload);
  }

  public retrieveAccessType(organisationProfileIds: string[]): Observable<JurisdictionResponse> {
    return this.http
      .post<JurisdictionResponse>('/api/retrieve-access-types', { organisationProfileIds: organisationProfileIds })
      .pipe(catchError((error: any) => throwError(() => error.json())));
  }
}
