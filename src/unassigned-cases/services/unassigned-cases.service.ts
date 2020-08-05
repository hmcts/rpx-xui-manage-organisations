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
        return this.http.get<any>(UnassignedCasesService.unassingedCaseTypesUrl);
    }
}
