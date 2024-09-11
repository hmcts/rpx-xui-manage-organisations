import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoggerService } from '../../../shared/services/logger.service';
import { FeeAccountsService } from '../../services';
import * as feeAccountsActions from '../actions';

@Injectable()
export class FeeAccountsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly feeAccountsService: FeeAccountsService,
    private readonly loggerService: LoggerService
  ) {}

  public loadFeeAccounts$ = createEffect(() => this.actions$.pipe(
    ofType(feeAccountsActions.LOAD_FEE_ACCOUNTS),
    switchMap((payload: any) => {
      return this.feeAccountsService.fetchFeeAccounts(payload.paymentAccounts).pipe(
        map((feeAccountsDetails) => new feeAccountsActions.LoadFeeAccountsSuccess(feeAccountsDetails)),
        catchError((errorResponse) => {
          this.loggerService.error(errorResponse);
          return errorResponse.status === 404 ? of(new feeAccountsActions.LoadFeeOneOrMoreAccountsFail(errorResponse.error)) :
            of(new feeAccountsActions.LoadFeeAccountsFail(errorResponse));
        })
      );
    })
  ));
}
