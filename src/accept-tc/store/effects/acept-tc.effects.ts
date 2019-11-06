import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as acceptTandCActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AcceptTcService } from '../../services/accept-tc.service';

@Injectable()
export class AcceptTcEffects {
  constructor(
    private actions$: Actions,
    private acceptTcService: AcceptTcService
  ) { }

  @Effect()
  loadHasAccepted$ = this.actions$.pipe(
    ofType(acceptTandCActions.LOAD_HAS_ACCEPTED_TC),
    switchMap(() => {
      return this.acceptTcService.getHasUserAccepted().pipe(
        map(tcDetails => {
          return new acceptTandCActions.LoadHasAcceptedTCSuccess(tcDetails);
        }),
        catchError(error => of(new acceptTandCActions.LoadHasAcceptedTCFail(error)))
      );
    })
  );

  @Effect()
  acceptTandC$ = this.actions$.pipe(
    ofType(acceptTandCActions.ACCEPT_T_AND_C),
    map((action: acceptTandCActions.AcceptTandC) => action.payload),
    switchMap((userData) => {
      return this.acceptTcService.acceptTandC(userData).pipe(
        map(tcDetails => {
          return new acceptTandCActions.AcceptTandCSuccess(tcDetails);
        }),
        catchError(error => of(new acceptTandCActions.AcceptTandCFail(error)))
      );
    })
  );
}
