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
        catchError(error => {
          this.loggerService.error(error.message);
          return of(new feeAccountsActions.LoadFeeAccountsFail(error));
        })
      );
    })
  );
}
