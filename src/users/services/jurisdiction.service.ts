import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class JurisdictionService {
    constructor(private http: HttpClient) { }

    public getJurisdictions(): Observable<any> {
        return this.http.get('api/jurisdictions');
      }
}
