import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as appActions from '../actions';
import {map} from 'rxjs/operators';

import * as usersActions from '../../../users/store/actions';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions
  ) {}

  @Effect()
  updateTitle$ = this.actions$.pipe(
    ofType(usersActions.UPDATE_ERROR_MESSAGES),
    map(() => {
      return new appActions.SetPageTitleErrors();
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType(appActions.LOGOUT),
    map(() => {
      window.location.href = '/api/logout';
    })
  );

}
