import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as usersActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {UsersService} from '../../services';



@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService
  ) {}

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType(usersActions.LOAD_USERS),
    switchMap(() => {
      return this.usersService.fetchUsers().pipe(
        map(userDetals => new usersActions.LoadUsersSuccess(userDetals)),
        catchError(error => of(new usersActions.LoadUsersFail(error)))
      );
    })
  );
}
