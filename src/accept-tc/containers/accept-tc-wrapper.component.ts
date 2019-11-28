import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie';
import { Observable, Subscription } from 'rxjs';
import * as fromStore from '../../../src/user-profile/store';
import * as fromRoot from '../../app/store';
/**
 * Terms And Condition smart component wrapper
 * absorbs Terms and Condition dumb component
 */
@Component({
  selector: 'app-accept-terms-conditions-wrapper',
  templateUrl: './accept-tc-wrapper.component.html'
})
export class AcceptTcWrapperComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  constructor(private store: Store<fromStore.AuthState>,
              private actions$: Actions,
              private cookieService: CookieService) {
  }

  ngOnInit(): void {
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

  onAcceptTandC() {
    const uid = this.cookieService.get('__userid__');
    this.store.dispatch(new fromStore.AcceptTandC(uid));
  }
}
