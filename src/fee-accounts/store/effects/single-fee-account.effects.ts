import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as singleFeeAccountActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {FeeAccountsService} from '../../services';



@Injectable()
export class SingleFeeAccountEffects {
  constructor(
    private actions$: Actions,
    private feeAccountsService: FeeAccountsService
  ) {}

  @Effect()
  loadSingleFeeAccount$ = this.actions$.pipe(
    ofType(singleFeeAccountActions.LOAD_SINGLE_FEE_ACCOUNT),
    switchMap((data: { payload: string, type: string}) => {
      console.log('LOAD_SINGLE_FEE_ACCOUNT ::: data is', data)
      return this.feeAccountsService.fetchSingleFeeAccount(data.payload).pipe(
        map(singleFeeAccountDetails => {
          console.log('singleFeeAccountDetails ===>', singleFeeAccountDetails)
          return new singleFeeAccountActions.LoadSingleFeeAccountSuccess(singleFeeAccountDetails)

        }),
        catchError(error => of(new singleFeeAccountActions.LoadSingleFeeAccountFail(error)))
      );
    })
  );

  @Effect()
  loadSingleFeeAccountTransactions$ = this.actions$.pipe(
    ofType(singleFeeAccountActions.LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS),
    switchMap((data: { payload: string, type: string}) => {
      console.log('data is LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS', data)
      return this.feeAccountsService.fetchPbAAccountTransactions(data.payload).pipe(
        map(transactions => {
         console.log('transactions', transactions)
          return new singleFeeAccountActions.LoadSingleFeeAccountTransactionsSuccess(transactions)

        }),
        catchError(error => of(new singleFeeAccountActions.LoadSingleFeeAccountTransactionsFail(error)))
      );
    })
  );
}
