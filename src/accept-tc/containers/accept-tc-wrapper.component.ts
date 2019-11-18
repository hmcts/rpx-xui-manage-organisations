import {Component, OnInit, OnDestroy} from '@angular/core';
import {select, Store, Action} from '@ngrx/store';
import * as fromStore from '../../../src/user-profile/store';
import * as fromRoot from '../../app/store';
import * as fromUserProfile from '../../user-profile/store/';
import {Observable, Subscription} from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
/**
 * Terms And Condition smart component wrapper
 * absorbs Terms and Condition dumb component
 */
@Component({
  selector: 'app-accept-terms-conditions-wrapper',
  templateUrl: './accept-tc-wrapper.component.html'
})
export class AcceptTcWrapperComponent implements OnInit, OnDestroy {
  uId: Observable<string>;
  subscription: Subscription;
  constructor(private store: Store<fromStore.AuthState>,
              private actions$: Actions) {
  }

  ngOnInit(): void {
    this.uId = this.store.pipe(select(fromUserProfile.getUid));
    this.subscription = this.getObservable(this.actions$, fromStore.AuthActionTypes.ACCEPT_T_AND_C_SUCCESS).subscribe(() => {
      this.dispatchAction(this.store, new fromRoot.Go({ path: ['home'] }));
    });
  }

  getObservable(actions$: Actions, action: string): Observable<never> {
    return actions$.pipe(ofType(action));
  }

  dispatchAction(store: Store<fromStore.AuthState>, action: Action) {
    store.dispatch(action);
  }

  ngOnDestroy() {
    this.unsubscribe(this.subscription);
  }

  unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  onAcceptTandC(uid) {
    this.store.dispatch(new fromStore.AcceptTandC(uid));
  }
}
