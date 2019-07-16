import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as usersActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {InviteUserService } from '../../services';



@Injectable()
export class InviteUserEffects {
  constructor(
    private actions$: Actions,
    private inviteUserSevice: InviteUserService
  ) {}

  @Effect()
  saveUsers$ = this.actions$.pipe(
    ofType(usersActions.SEND_INVITE_USER),
    map((action: usersActions.SendInviteUser) => action.payload),
    switchMap((inviteUserFormData) => {
      return this.inviteUserSevice.inviteUser(inviteUserFormData).pipe(
        map(userDetails => new usersActions.InviteUserSuccess(userDetails)),
        catchError(error => of(new usersActions.InviteUserFail(error)))
      );
    })
  );
}
