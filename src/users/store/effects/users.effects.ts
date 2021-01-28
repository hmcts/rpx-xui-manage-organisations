import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store';
import { LoggerService } from '../../../shared/services/logger.service';
import { UsersService } from '../../services';
import * as usersActions from '../actions';

@Injectable()
export class UsersEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly usersService: UsersService,
    private readonly loggerService: LoggerService
  ) { }

  @Effect()
  public loadUsers$ = this.actions$.pipe(
    ofType(usersActions.LOAD_USERS),
    switchMap(() => {
      return this.usersService.getListOfUsers().pipe(
        map(userDetails => {
          const amendedUsers = [];
          userDetails.users.forEach(element => {
              const fullName = `${element.firstName} ${element.lastName}`;
              const user = element;
              user.fullName = fullName;
              user.routerLink = `user/${user.userIdentifier}`;
              user.routerLinkTitle = `User details for ${fullName} with id ${user.userIdentifier}`;
              amendedUsers.push(user);
          });

          return new usersActions.LoadUsersSuccess({users: amendedUsers});
        }),
        catchError(error => {
          this.loggerService.error(error.message);
          return of(new usersActions.LoadUsersFail(error));
        })
      );
    })
  );


  @Effect()
  public suspendUser$ = this.actions$.pipe(
    ofType(usersActions.SUSPEND_USER),
    switchMap((user: usersActions.SuspendUser) => {
      return this.usersService.suspendUser(user).pipe(
        map(res => new usersActions.SuspendUserSuccess(user.payload)),
        catchError(error => of(new usersActions.SuspendUserFail(error)))
      );
    })
  );

  @Effect()
  public inviteNewUser$ = this.actions$.pipe(
    ofType(usersActions.INVITE_NEW_USER),
    map(() => {
      return new fromRoot.Go({ path: ['users/invite-user'] });
    })
  );

  @Effect()
  public reinviteUser$ = this.actions$.pipe(
    ofType(usersActions.REINVITE_PENDING_USER),
    map(() => {
      return new fromRoot.Go({ path: ['users/invite-user'] });
    })
  );
}
