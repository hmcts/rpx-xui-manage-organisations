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
    caseTypeId: string, pageNo: number, pageSize: number, caaCasesPageType: string, caaCasesFilterType: string | null, caaCasesFilterValue: string | null): Observable<any> {
    let url = `${CaaCasesService.caaCasesUrl}?caseTypeId=${caseTypeId}&pageNo=${pageNo}&pageSize=${pageSize}&caaCasesPageType=${caaCasesPageType}`;
		if (caaCasesFilterType) {
			url += `&caaCasesFilterType=${caaCasesFilterType}`;
		}
    if (caaCasesFilterValue) {
      url += `&caaCasesFilterValue=${caaCasesFilterValue}`;
    }
    return this.http.post<any>(url, null);
  }

  public getCaaCaseTypes(): Observable<any> {
    return this.http.post<any>(CaaCasesService.caaCaseTypesUrl, null);
  }
}
