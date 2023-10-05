import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LovRefDataModel } from '../models/lovRefData.model';
import { RegulatoryOrganisationType } from '../../register-org/models/regulatory-organisation-type.model';

@Injectable({ providedIn: 'root' })
export class LovRefDataService {
  public constructor(private readonly http: HttpClient) {}

  public getListOfValues(category: string, isChildRequired: boolean = false): Observable<LovRefDataModel[]> {
    const options = {
      params: new HttpParams()
        .set('categoryId', category)
        .set('isChildRequired', isChildRequired ? 'Y' : 'N')
    };
    return this.http.get<LovRefDataModel[]>('external/getLovRefData', options);
  }

  public getListOfValuesForService(category: string, service: string, isChildRequired: boolean = false): Observable<LovRefDataModel[]> {
    const options = {
      params: new HttpParams()
        .set('categoryId', category)
        .set('serviceId', service)
        .set('isChildRequired', isChildRequired ? 'Y' : 'N')
    };
    return this.http.get<LovRefDataModel[]>('external/getLovRefData', options);
  }

  public getRegulatoryOrganisationTypes(): Observable<RegulatoryOrganisationType[]> {
    return this.http.get<RegulatoryOrganisationType[]>('external/regulatoryOrganisationTypes');
  }
}
