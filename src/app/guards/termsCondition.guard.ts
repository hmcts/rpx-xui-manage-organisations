import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import * as fromUserProfile from '../../user-profile/store';
import * as fromRoot from '../../app/store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable()
export class TermsConditionGuard implements CanActivate {
  constructor(
    private store: Store<fromRoot.State>,
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.checkStore(this.store).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(store: Store<fromRoot.State>) {
    return store.pipe(select(fromUserProfile.getHasUserSelectedTC),
      tap(tcConfirmed => {
        this.loadTandCIfNotLoaded(tcConfirmed, store);
        this.dispatchGoIfUserHasNotAccepted(tcConfirmed, store, '/accept-t-and-c');

      }),
      filter(tcConfirmed => tcConfirmed.loaded),
      take(1)
    );
  }

  dispatchGoIfUserHasNotAccepted(tcConfirmed: { hasUserAccepted: string; loaded: boolean; }, store: Store<fromRoot.State>, url: string) {
    if (tcConfirmed.hasUserAccepted === 'false' && tcConfirmed.loaded) {
      store.dispatch(new fromRoot.Go({ path: [url] }));
    }
  }

  loadTandCIfNotLoaded(tcConfirmed: { hasUserAccepted: string; loaded: boolean; }, store: Store<fromRoot.State>) {
    if (!tcConfirmed.loaded) {
      store.pipe(select(fromUserProfile.getUid), take(2)).subscribe(uid => {
        this.dispatchLoadHasAcceptedTC(uid, store);
      });
    }
  }

  dispatchLoadHasAcceptedTC(uid: any, store: Store<fromRoot.State>) {
    if (uid) {
      store.dispatch(new fromUserProfile.LoadHasAcceptedTC(uid));
    }
  }
}
