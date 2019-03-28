import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as usersActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {InviteUserService, UsersService} from '../../services';



@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private inviteUserSevice: InviteUserService
  ) {}

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType(usersActions.LOAD_USERS),
    switchMap(() => {
      return this.usersService.getListOfUsers().pipe(
        map(userDetals => new usersActions.LoadUsersSuccess(userDetals)),
        catchError(error => of(new usersActions.LoadUsersFail(error)))
      );
    })
  );

  @Effect()
  saveUsers$ = this.actions$.pipe(
    ofType(usersActions.INVITE_USER),
    map((action: usersActions.InviteUser) => action.payload),
    switchMap((inviteUserFormData) => {
      return this.inviteUserSevice.inviteUser(inviteUserFormData).pipe(
        map(userDetails => new usersActions.InviteUserSuccess(userDetails)),
        catchError(error => of(new usersActions.InviteUserFail(error)))
      );
    })
  );
}
