import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as feeAccountSummaryActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {FeeAccountsService} from '../../services';



@Injectable()
export class FeeAccountSummaryEffects {
  constructor(
    private actions$: Actions,
    private feeAccountsService: FeeAccountsService
  ) {}

  @Effect()
  loadFeeAccountSummary$ = this.actions$.pipe(
    ofType(feeAccountSummaryActions.LOAD_FEE_ACCOUNT_SUMMARY),
    switchMap((id) => {
      return this.feeAccountsService.fetchFeeAccountSummary(id).pipe(
        map(feeAccountSummaryDetails => new feeAccountSummaryActions.LoadFeeAccountSummarySuccess(feeAccountSummaryDetails)),
        catchError(error => of(new feeAccountSummaryActions.LoadFeeAccountSummaryFail(error)))
      );
    })
  );
}
