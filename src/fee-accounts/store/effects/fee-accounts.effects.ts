import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as feeAccountsActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {FeeAccountsService} from '../../services';



@Injectable()
export class FeeAccountsEffects {
  constructor(
    private actions$: Actions,
    private feeAccountsService: FeeAccountsService
  ) {}

  @Effect()
  loadFeeAccounts$ = this.actions$.pipe(
    ofType(feeAccountsActions.LOAD_FEE_ACCOUNTS),
    switchMap(() => {
      console.log('loadFeeAccounts$')
      return this.feeAccountsService.fetchFeeAccounts().pipe(
        map(feeAccountsDetails => {
          console.log('asdasd', feeAccountsDetails)
           return new feeAccountsActions.LoadFeeAccountsSuccess(feeAccountsDetails)
          }),
        catchError(error => {
          console.log('error', error)
          return of(new feeAccountsActions.LoadFeeAccountsFail(error)))
        }
      );
    })
  );
}
