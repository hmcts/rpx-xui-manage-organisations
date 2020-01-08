import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as singleFeeAccountActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {FeeAccountsService} from '../../services';
import { LoggerService } from '../../../shared/services/logger.service';



@Injectable()
export class SingleFeeAccountEffects {
  constructor(
    private actions$: Actions,
    private feeAccountsService: FeeAccountsService,
    private loggerService: LoggerService
  ) {}

  @Effect()
  loadSingleFeeAccount$ = this.actions$.pipe(
    ofType(singleFeeAccountActions.LOAD_SINGLE_FEE_ACCOUNT),
    switchMap((data: { payload: string, type: string}) => {
      this.loggerService.log('LOAD_SINGLE_FEE_ACCOUNT ::: data is');
      return this.feeAccountsService.fetchSingleFeeAccount(data.payload).pipe(
        map(singleFeeAccountDetails => {
          this.loggerService.log('singleFeeAccountDetails ===>');
          return new singleFeeAccountActions.LoadSingleFeeAccountSuccess(singleFeeAccountDetails);

        }),
        catchError(error => of(new singleFeeAccountActions.LoadSingleFeeAccountFail(error)))
      );
    })
  );

  @Effect()
  loadSingleFeeAccountTransactions$ = this.actions$.pipe(
    ofType(singleFeeAccountActions.LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS),
    switchMap((data: { payload: string, type: string}) => {
      this.loggerService.log('data is LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS');
      return this.feeAccountsService.fetchPbAAccountTransactions(data.payload).pipe(
        map(transactions => {
          this.loggerService.log('transactions');
          return new singleFeeAccountActions.LoadSingleFeeAccountTransactionsSuccess(transactions);

        }),
        catchError(error => of(new singleFeeAccountActions.LoadSingleFeeAccountTransactionsFail(error)))
      );
    })
  );
}
