import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PendingPaymentAccount } from '../../models/pendingPaymentAccount.model';

@Injectable()
export class PBAService {
  constructor(private readonly http: HttpClient) {}

  public updatePBAs(pendingPaymentAccount: PendingPaymentAccount): Observable<any> {
    return this.http.post<any>('api/pba/addDeletePBA', { pendingPaymentAccount });
  }
}
