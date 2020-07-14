import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UnassignedCasesService {
    constructor(private readonly http: HttpClient) { }
    public fetchUnassignedCases(): Observable<any> {
        return this.http.get<any>('/api/unassignedcases');
    }
}
