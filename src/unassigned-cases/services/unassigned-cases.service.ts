import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UnassignedCasesService {
    public static unassignedCasesUrl: string = '/api/unassignedcases';
    public static unassingedCaseTypesUrl: string = '/api/unassignedCaseTypes';
    constructor(private readonly http: HttpClient) { }
    public fetchUnassignedCases(caseTypeId: string): Observable<any> {
         const url = `${UnassignedCasesService.unassignedCasesUrl}?caseTypeId=${caseTypeId}`;
         return this.http.post<any>(url, null);
    }

    public fetchUnassignedCaseTypes(): Observable<any> {
        return this.http.post<any>(UnassignedCasesService.unassingedCaseTypesUrl, null);
    }
}
