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
    switchMap((payload: any) => {
      return this.feeAccountsService.fetchFeeAccounts(payload.paymentAccounts).pipe(
        map(feeAccountsDetails => new feeAccountsActions.LoadFeeAccountsSuccess(feeAccountsDetails)),
        catchError(errorResponse => {
          return errorResponse.status === 404 ? of(new feeAccountsActions.LoadFeeOneOrMoreAccountsFail(errorResponse.error)) :
          of(new feeAccountsActions.LoadFeeAccountsFail(errorResponse));
        })
      );
    })
  );
}
