import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromStore from '../../../src/user-profile/store';
import * as fromRoot from '../../app/store';
import * as fromUserProfile from '../../user-profile/store';

/**
 * Terms And Condition smart component wrapper
 * absorbs Terms and Condition dumb component
 */
@Component({
  selector: 'app-accept-terms-conditions-wrapper',
  templateUrl: './accept-tc-wrapper.component.html',
  styleUrls: ['./accept-tc-wrapper.component.scss']
})
export class AcceptTcWrapperComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public uidSubscription: Subscription;
  private uid: string;
  constructor(
    private readonly store: Store<fromStore.AuthState>,
    private readonly actions$: Actions
  ) {}

  public ngOnInit(): void {
    this.uidSubscription = this.store.pipe(select(fromUserProfile.getUid)).subscribe(uid => this.uid = uid);
    this.subscription = this.getObservable(this.actions$, fromStore.AuthActionTypes.ACCEPT_T_AND_C_SUCCESS).subscribe(() => {
      this.dispatchAction(this.store, new fromRoot.Go({ path: ['home'] }));
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subscription);
    this.unsubscribe(this.uidSubscription);
  }

  getObservable(actions$: Actions, action: string): Observable<never> {
    return actions$.pipe(ofType(action));
  }

  dispatchAction(store: Store<fromStore.AuthState>, action: Action) {
    store.dispatch(action);
  }

  unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  onAcceptTandC() {
    this.store.dispatch(new fromStore.AcceptTandC(this.uid));
  }
}
