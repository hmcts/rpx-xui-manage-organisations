import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TCDocument } from '@hmcts/rpx-xui-common-lib';
import { Observable, map } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class TermsConditionsService {
  constructor(
    private readonly http: HttpClient,
    private readonly environmentService: EnvironmentService
  ) {}

  public getTermsConditions(): Observable<TCDocument> {
    return this.http.get<TCDocument>('api/termsAndConditions');
  }

  public isTermsConditionsFeatureEnabled(): Observable<boolean> {
    return this.environmentService.config$.pipe(
      map((config) => Boolean(config?.termsAndConditionsEnabled))
    );
  }
}
