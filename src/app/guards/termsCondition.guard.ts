import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import { TermsConditionsService } from '../../../src/shared/services/termsConditions.service';
import * as fromRoot from '../../app/store';
import * as fromUserProfile from '../../user-profile/store';

@Injectable()
export class TermsConditionGuard implements CanActivate {
  constructor(
    private readonly store: Store<fromRoot.State>,
    private readonly termsAndConditionsService: TermsConditionsService
  ) {
  }

  public canActivate(): Observable<boolean> {
    const isTandCEnabled$ = this.termsAndConditionsService.isTermsConditionsFeatureEnabled();
    return isTandCEnabled$.pipe(switchMap(enabled => enabled ? this.queryTermsAndConditions() : of(true)));
  }

  private queryTermsAndConditions(): Observable<boolean> {
    return this.checkStore(this.store).pipe(switchMap(() => of(true)), catchError(() => of(false)));
  }

  public checkStore(store: Store<fromRoot.State>) {
    return store.pipe(select(fromUserProfile.getHasUserSelectedTC),
      tap(tcConfirmed => {
        this.loadTandCIfNotLoaded(tcConfirmed, store);
        this.dispatchGoIfUserHasNotAccepted(tcConfirmed, store, '/accept-terms-and-conditions');

      }),
      filter(tcConfirmed => tcConfirmed.loaded),
      take(1)
    );
  }

  public dispatchGoIfUserHasNotAccepted(tcConfirmed: { hasUserAccepted: string; loaded: boolean; }, store: Store<fromRoot.State>, url: string) {
    if (tcConfirmed.hasUserAccepted === 'false' && tcConfirmed.loaded) {
      store.dispatch(new fromRoot.Go({ path: [url] }));
    }
  }

  public loadTandCIfNotLoaded(tcConfirmed: { hasUserAccepted: string; loaded: boolean; }, store: Store<fromRoot.State>) {
    if (!tcConfirmed.loaded) {
      store.pipe(select(fromUserProfile.getUid), take(2)).subscribe(uid => {
        this.dispatchLoadHasAcceptedTC(uid, store);
      });
    }
  }

  public dispatchLoadHasAcceptedTC(uid: any, store: Store<fromRoot.State>) {
    if (uid) {
      store.dispatch(new fromUserProfile.LoadHasAcceptedTC(uid));
    }
  }
}
