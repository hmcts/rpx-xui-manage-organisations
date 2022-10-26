import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import { LoggerService } from '../../../shared/services/logger.service';
import {FeeAccountsService} from '../../services';
import * as feeAccountsActions from '../actions';



@Injectable()
export class FeeAccountsEffects {
  constructor(
    private actions$: Actions,
    private feeAccountsService: FeeAccountsService,
    private loggerService: LoggerService
  ) {}

  @Effect()
  public loadFeeAccounts$ = this.actions$.pipe(
    ofType(feeAccountsActions.LOAD_FEE_ACCOUNTS),
    switchMap((payload: any) => {
      return this.feeAccountsService.fetchFeeAccounts(payload.paymentAccounts).pipe(
        map(feeAccountsDetails => new feeAccountsActions.LoadFeeAccountsSuccess(feeAccountsDetails)),
        catchError(errorResponse => {
          this.loggerService.error(errorResponse);
          return errorResponse.status === 404 ? of(new feeAccountsActions.LoadFeeOneOrMoreAccountsFail(errorResponse.error)) :
          of(new feeAccountsActions.LoadFeeAccountsFail(errorResponse));
        })
      );
    })
  );
}
