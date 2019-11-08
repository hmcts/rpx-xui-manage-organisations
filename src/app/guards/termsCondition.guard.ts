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
    private store: Store<fromRoot.State>,
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    )
  }

  checkStore() {
    return this.store.pipe(select(fromUserProfile.getHasUserSelectedTC),
      tap(tcConfirmed => {
        if (!tcConfirmed.loaded) {
          this.store.dispatch(new fromUserProfile.LoadHasAcceptedTC());
        }
        if (tcConfirmed.hasUserAccepted === 'false') {
          this.store.dispatch(new fromRoot.Go({path: ['/accept-t-and-c']}));
        }

      }),
      filter(tcConfirmed => tcConfirmed.loaded),
      take(1)
    );
  }


}
