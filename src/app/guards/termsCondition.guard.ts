import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import * as fromUserProfile from '../../user-profile/store';
import * as fromRoot from '../../app/store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class TermsConditionGuard implements CanActivate {
  constructor(
    private store: Store<fromRoot.State>,
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore() {
    return this.store.pipe(select(fromUserProfile.getHasUserSelectedTC),
      tap(tcConfirmed => {
        if (!tcConfirmed.loaded) {
          this.store.pipe(select(fromUserProfile.getUid), take(2)).subscribe(uid => {
            if (uid) {
              this.store.dispatch(new fromUserProfile.LoadHasAcceptedTC(uid));
            }
          });
        }
        if (tcConfirmed.hasUserAccepted === 'false' && tcConfirmed.loaded) {
          this.store.dispatch(new fromRoot.Go({path: ['/accept-t-and-c']}));
        }

      }),
      filter(tcConfirmed => tcConfirmed.loaded),
      take(1)
    );
  }


}
