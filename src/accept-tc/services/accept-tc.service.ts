import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AcceptTcService {
  constructor(private http: HttpClient) { }

  getHasUserAccepted(): Observable<any> {
    return this.http
      .get<any>(`/api/tbc`)
      .pipe(catchError((error: any) => throwError(error.json())));
  }


}
