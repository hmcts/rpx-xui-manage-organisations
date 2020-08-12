import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UnassignedCasesService {
    public static unassignedCasesUrl: string = '/api/unassignedcases';
    public static unassingedCaseTypesUrl: string = '/api/unassignedCaseTypes';
    constructor(private readonly http: HttpClient) { }
    public fetchUnassignedCases(): Observable<any> {
        return this.http.get<any>(UnassignedCasesService.unassignedCasesUrl);
    }
    public fetchUnassignedCaseTypes(): Observable<any> {
        const body = {
            query: {
               bool: {
                  filter: [
                     {
                        multi_match : { query: '9QV1DT1', type: 'phrase', fields: ['data.*.Organisation.OrganisationID' ] }
                     }
                  ]
               }
            },
            from: 0,
            size: 6,
            _source: false,
            sort: {
               created_date: {
                  order: 'desc'
               }
            }
         };
        return this.http.post<any>(UnassignedCasesService.unassingedCaseTypesUrl, body);
    }
}
