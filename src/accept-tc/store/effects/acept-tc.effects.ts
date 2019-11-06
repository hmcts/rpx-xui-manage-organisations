import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as usersActions from '../actions';
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
  loadUsers$ = this.actions$.pipe(
    ofType(usersActions.LOAD_HAS_ACCEPTED_TC),
    switchMap(() => {
      return this.acceptTcService.getHasUserAccepted().pipe(
        map(tcDetails => {
          return new usersActions.LoadHasAcceptedTCSuccess(tcDetails);
        }),
        catchError(error => of(new usersActions.LoadHasAcceptedTCFail(error)))
      );
    })
  );
}
