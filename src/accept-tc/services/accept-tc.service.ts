import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AcceptTcService {
  constructor(private readonly http: HttpClient) {}
  // TO DO add proper typings
  public getHasUserAccepted(userId: string): Observable<any> {
    return this.http
      .get<any>(`/api/userTermsAndConditions/${userId}`)
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  public acceptTandC(userId): Observable<any> {
    return this.http.post('/api/userTermsAndConditions', { userId });
  }
}
