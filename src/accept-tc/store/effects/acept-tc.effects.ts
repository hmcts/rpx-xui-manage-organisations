import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as appActions from '../../../app/store/index';
import { AcceptTcService } from '../../services/accept-tc.service';
import * as acceptTandCActions from '../actions';

@Injectable()
export class AcceptTcEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly acceptTcService: AcceptTcService
  ) { }

  @Effect()
  public acceptTandC$ = this.actions$.pipe(
    ofType(acceptTandCActions.ACCEPT_T_AND_C),
    map((action: acceptTandCActions.AcceptTandC) => action.payload),
    switchMap((userData) => {
      return this.acceptTcService.acceptTandC(userData).pipe(
        map(tcDetails => {
          return new acceptTandCActions.AcceptTandCSuccess(tcDetails);
        }),
        catchError(err => of(new appActions.Go({ path: ['/service-down'] })))
      );
    })
  );
}
