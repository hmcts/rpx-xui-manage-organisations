import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import * as fromUserProfile from '../../user-profile/store';
import * as fromRoot from '../../app/store';
import {catchError, filter, switchMap, take, tap, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable()
export class TermsConditionGuard implements CanActivate {
  constructor(
    private store: Store<fromUserProfile.AuthState>,
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    )
  }

  checkStore(): Observable<boolean> {
    return this.store.pipe(select(fromUserProfile.getHasUserSelectedTC),
      tap(tcConfirmed => {
        if (!tcConfirmed) {
          this.store.dispatch(new fromRoot.Go({path: ['/accept-t-and-c']}));
        }
      }),
      filter(tcConfirmed => tcConfirmed),
      take(1)
    );
  }


}
