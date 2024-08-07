import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import * as fromFeature from '../store';
import { LoadSingleFeeAccount } from '../store/actions/single-fee-account.actions';
import { pbaAccountSummaryLoaded } from '../store/selectors/single-fee-account.selectors';

@Injectable()
export class AccountSummaryGuard {
  constructor(private readonly store: Store<fromFeature.FeeAccountsState>) {}

  public canActivate(): Observable<boolean> {
    return this.checkStore()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  public checkStore(): Observable<boolean> {
    return this.store.pipe(
      select(pbaAccountSummaryLoaded),
      tap((loaded) => {
        if (!loaded) {
          this.store.dispatch(new LoadSingleFeeAccount('2A2ABCDFFFA'));
        }
      }),
      filter((loaded) => loaded),
      take(1)
    );
  }
}
