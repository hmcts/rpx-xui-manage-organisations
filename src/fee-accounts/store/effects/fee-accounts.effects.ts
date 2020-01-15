import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as feeAccountsActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {FeeAccountsService} from '../../services';
import { LoggerService } from '../../../shared/services/logger.service';



@Injectable()
export class FeeAccountsEffects {
  constructor(
    private actions$: Actions,
    private feeAccountsService: FeeAccountsService,
    private loggerService: LoggerService
  ) {}

  @Effect()
  loadFeeAccounts$ = this.actions$.pipe(
    ofType(feeAccountsActions.LOAD_FEE_ACCOUNTS),
    switchMap((payload: any) => {
      return this.feeAccountsService.fetchFeeAccounts(payload.paymentAccounts).pipe(
        map(feeAccountsDetails => new feeAccountsActions.LoadFeeAccountsSuccess(feeAccountsDetails)),
<<<<<<< HEAD
        catchError(errorResponse => {
          return errorResponse.status === 404 ? of(new feeAccountsActions.LoadFeeOneOrMoreAccountsFail(errorResponse.error)) :
          of(new feeAccountsActions.LoadFeeAccountsFail(errorResponse));
=======
        catchError(error => {
          this.loggerService.error(error.message);
          return of(new feeAccountsActions.LoadFeeAccountsFail(error));
>>>>>>> 5c7f86a1f0b68ad3a23c6ab8a0e2496080c7e850
        })
      );
    })
  );
}
