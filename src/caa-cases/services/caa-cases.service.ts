import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CaaCasesService {

  public static caaCasesUrl: string = '/api/caaCases';
  public static caaCaseTypesUrl: string = '/api/caaCaseTypes';

  constructor(private readonly http: HttpClient) {
  }

  public getCaaCases(
    caseTypeId: string, pageNo: number, pageSize: number, caaCasesFilterType: string, caaCasesFilterValue: string, caaCasesPageType: string): Observable<any> {
    const url = `${CaaCasesService.caaCasesUrl}?caseTypeId=${caseTypeId}&pageNo=${pageNo}&pageSize=${pageSize}&caaCasesPageType=${caaCasesPageType}&caaCasesFilterType=${caaCasesFilterType}&caaCasesFilterValue=${caaCasesFilterValue}`;
    return this.http.post<any>(url, null);
  }

  public getCaaCaseTypes(): Observable<any> {
    return this.http.post<any>(CaaCasesService.caaCaseTypesUrl, null);
  }
}
