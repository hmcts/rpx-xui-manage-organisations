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
    url += this.getFilterType(caaCasesFilterType);
    url += this.getFilterValue(caaCasesFilterValue);
    return this.http.post<any>(url, null);
  }

  public getCaaCaseTypes(caaCasesPageType: string, caaCasesFilterType: string | null, caaCasesFilterValue: string | null): Observable<any> {
    let url = `${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=${caaCasesPageType}`;
    url += this.getFilterType(caaCasesFilterType);
    url += this.getFilterValue(caaCasesFilterValue);
    return this.http.post<any>(url, null);
  }

  public storeState(key: string, value: any): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  public retrieveState(key: string): any {
    return window.sessionStorage.getItem(key) ? JSON.parse(window.sessionStorage.getItem(key)) : null;
  }

  private getFilterType(caaCasesFilterType: string | null): string {
    if (caaCasesFilterType) {
      return `&caaCasesFilterType=${caaCasesFilterType}`;
    }
    return '';
  }

  private getFilterValue(caaCasesFilterValue: string | null): string {
    if (caaCasesFilterValue) {
      return `&caaCasesFilterValue=${caaCasesFilterValue}`;
    }
    return '';
  }
}
