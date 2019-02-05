import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as userformActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserformService } from '../../services';



@Injectable()
export class UserformEffects {
  constructor(
    private actions$: Actions,
    private userformService: UserformService
  ) { }

  @Effect()
  saveUsers$ = this.actions$.pipe(
    ofType(userformActions.SAVE_USER),
    switchMap(() => {
      return this.userformService.saveUser().pipe(
        map(userDetals => new userformActions.SaveUserSuccess(userDetals)),
        catchError(error => of(new userformActions.SaveUserFail(error)))
      );
    })
  );
}
