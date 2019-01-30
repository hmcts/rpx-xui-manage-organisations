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
    switchMap((id) => {
      return this.feeAccountsService.fetchSingleFeeAccount(id).pipe(
        map(singleFeeAccountDetails => new singleFeeAccountActions.LoadSingleFeeAccountSuccess(singleFeeAccountDetails)),
        catchError(error => of(new singleFeeAccountActions.LoadSingleFeeAccountFail(error)))
      );
    })
  );
}
