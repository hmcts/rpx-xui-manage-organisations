import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {Observable, of} from 'rxjs';

@Injectable()
export class AcceptTermsAndConditionGuard implements CanActivate {

  constructor() {
  }

  public canActivate(): Observable<boolean> {
    return of(true);
  }

}
