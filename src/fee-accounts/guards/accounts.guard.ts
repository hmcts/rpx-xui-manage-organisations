import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
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
import { LoadFeeAccounts } from '../store/actions/fee-accounts.actions';
import { feeAccountsLoaded } from '../store/selectors/fee-accounts.selectors';

@Injectable()
export class AccountsGuard implements CanActivate {

  constructor(private store: Store<fromFeature.FeeAccountsState>) {
  }

  canActivate(): Observable<boolean> {
    return this.checkStore()
      .pipe(
        switchMap(() => of(true)),
        catchError((error: any) => of(false))
      );
  }

  checkStore(): Observable<boolean> {
    return this.store.pipe(
      select(feeAccountsLoaded),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new LoadFeeAccounts());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }

}
