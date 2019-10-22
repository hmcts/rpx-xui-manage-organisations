import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as usersActions from '../actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {InviteUserService, JurisdictionService } from '../../services';
import * as fromRoot from '../../../app/store';
import { LoggerService } from 'src/shared/services/logger.service';
import { UserService } from 'src/user-profile/services/user.service';


@Injectable()
export class InviteUserEffects {
  constructor(
    private actions$: Actions,
    private inviteUserSevice: InviteUserService,
    private userService: UserService,
    private loggerService: LoggerService
  ) {}

  @Effect()
  saveUser$ = this.actions$.pipe(
    ofType(usersActions.SEND_INVITE_USER),
    map((action: usersActions.SendInviteUser) => action.payload),
    switchMap((inviteUserFormData) => {
      return this.inviteUserSevice.inviteUser(inviteUserFormData).pipe(
        map(userDetails => new usersActions.InviteUserSuccess(userDetails)),
        tap(() => this.loggerService.info('User Invited')),
        catchError(error => of(new usersActions.InviteUserFail(error)))
      );
    })
  );

  @Effect()
  confirmUser$ = this.actions$.pipe(
    ofType(usersActions.INVITE_USER_SUCCESS),
    map(() => {
      return new fromRoot.Go({ path: ['users/invite-user-success'] });
    })
  );

  @Effect()
  editUser$ = this.actions$.pipe(
    ofType(usersActions.EDIT_USER),
    map((action: usersActions.EditUser) => action.payload),
    switchMap((user) => {
      console.log(user);
      return this.userService.editUserPermissions(user).pipe(
        map( result => {
          if (result.addRolesResponse && result.addRolesResponse.idamStatusCode && result.addRolesResponse.idamStatusCode === '201') {
            return new usersActions.EditUserSuccess(user.userId);
          } else {
            // return new usersActions.EditUserSuccess(user.userId);
          }
        })
      );
    })
  );

  @Effect()
  confirmEditUser$ = this.actions$.pipe(
    ofType(usersActions.EDIT_USER_SUCCESS),
    map((user: any) => {
       return new fromRoot.Go({ path: [`users/user/${user.payload}`] });
    })
  );
}
