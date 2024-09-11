import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoggerService } from '../../../shared/services/logger.service';
import { FeeAccountsService } from '../../services';
import * as singleFeeAccountActions from '../actions';

@Injectable()
export class SingleFeeAccountEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly feeAccountsService: FeeAccountsService,
    private readonly loggerService: LoggerService
  ) {}

  public loadSingleFeeAccount$ = createEffect(() => this.actions$.pipe(
    ofType(singleFeeAccountActions.LOAD_SINGLE_FEE_ACCOUNT),
    switchMap(() => {
      this.loggerService.log('LOAD_SINGLE_FEE_ACCOUNT ::: data is');
      return this.feeAccountsService.fetchSingleFeeAccount().pipe(
        map((singleFeeAccountDetails) => {
          this.loggerService.log('singleFeeAccountDetails ===>');
          return new singleFeeAccountActions.LoadSingleFeeAccountSuccess(singleFeeAccountDetails);
        }),
        catchError((error) => {
          this.loggerService.error(error.message);
          return of(new singleFeeAccountActions.LoadSingleFeeAccountFail(error));
        })
      );
    })
  ));

  public loadSingleFeeAccountTransactions$ = createEffect(() => this.actions$.pipe(
    ofType(singleFeeAccountActions.LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS),
    switchMap((data: { payload: string, type: string}) => {
      this.loggerService.log('data is LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS');
      return this.feeAccountsService.fetchPbAAccountTransactions(data.payload).pipe(
        map((transactions) => {
          this.loggerService.log('transactions');
          return new singleFeeAccountActions.LoadSingleFeeAccountTransactionsSuccess(transactions);
        }),
        catchError((error) => {
          this.loggerService.error(error.message);
          return of(new singleFeeAccountActions.LoadSingleFeeAccountTransactionsFail(error));
        })
      );
    })
  ));
}
