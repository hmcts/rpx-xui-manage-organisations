import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CaaCases, CaaCasesSessionState, CaaCasesSessionStateValue } from '../models/caa-cases.model';

@Injectable()
export class CaaCasesService {
  public static caaCasesUrl: string = '/api/caaCases';
  public static caaCaseTypesUrl: string = '/api/caaCaseTypes';

  constructor(private readonly http: HttpClient) {
  }

  public getCaaCases(
    caseTypeId: string, pageNo: number, pageSize: number, caaCasesPageType: string, caaCasesFilterType: string | null, caaCasesFilterValue: string | null): Observable<CaaCases> {
    let url = `${CaaCasesService.caaCasesUrl}?caseTypeId=${caseTypeId}&pageNo=${pageNo}&pageSize=${pageSize}&caaCasesPageType=${caaCasesPageType}`;
    url += this.getFilterType(caaCasesFilterType);
    url += this.getFilterValue(caaCasesFilterValue);
    return this.http.post<CaaCases>(url, null);
  }

  public getCaaCaseTypes(caaCasesPageType: string, caaCasesFilterType: string | null, caaCasesFilterValue: string | null): Observable<any> {
    let url = `${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=${caaCasesPageType}`;
    url += this.getFilterType(caaCasesFilterType);
    url += this.getFilterValue(caaCasesFilterValue);
    return this.http.post<any>(url, null);
  }

  public storeSessionState(sessionState: CaaCasesSessionState): void {
    window.sessionStorage.setItem(sessionState.key, JSON.stringify(sessionState.value));
  }

  public retrieveSessionState(key: string): CaaCasesSessionStateValue {
    return window.sessionStorage.getItem(key) ? JSON.parse(window.sessionStorage.getItem(key)) : null;
  }

  public removeSessionState(key: string): void {
    window.sessionStorage.removeItem(key);
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
