import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JurisdictionService {
    constructor(private http: HttpClient) { }

    getJurisdictions(): Observable<any> {
        return this.http.get('api/jurisdictions');
      }
}
