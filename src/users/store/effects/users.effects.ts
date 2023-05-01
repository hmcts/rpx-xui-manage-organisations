import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
  ) {}

  public loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.LOAD_USERS),
      switchMap((action: any) => {
        return this.usersService.getListOfUsers(action.payload).pipe(
          map((userDetails) => {
            const amendedUsers = [];
            userDetails.users.forEach((element) => {
              const fullName = `${element.firstName} ${element.lastName}`;
              const user = element;
              user.fullName = fullName;
              user.routerLink = `user/${user.userIdentifier}`;
              user.routerLinkTitle = `User details for ${fullName} with id ${user.userIdentifier}`;
              amendedUsers.push(user);
            });

            return new usersActions.LoadUsersSuccess({ users: amendedUsers });
          }),
          catchError((error) => {
            this.loggerService.error(error.message);
            return of(new usersActions.LoadUsersFail(error));
          })
        );
      })
    )
  );

  public loadAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.LOAD_ALL_USERS),
      switchMap(() => {
        return this.usersService.getAllUsersListwithReturnRoles().pipe(
          map(() => new usersActions.LoadAllUsersSuccess()),
          catchError((error) => {
            this.loggerService.error(error.message);
            return of(new usersActions.LoadAllUsersFail(error));
          })
        );
      })
    )
  );

  public loadUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.LOAD_USER_DETAILS),
      switchMap((action: any) => {
        return this.usersService.getUserDetailsWithPermission(action.payload).pipe(
          map((userDetails) => {
            let amendedUser;
            userDetails.users.forEach((element) => {
              const fullName = `${element.firstName} ${element.lastName}`;
              const user = element;
              user.fullName = fullName;
              user.routerLink = `user/${user.userIdentifier}`;
              user.routerLinkTitle = `User details for ${fullName} with id ${user.userIdentifier}`;
              amendedUser = user;
            });
            return new usersActions.LoadUserDetailsSuccess(amendedUser);
          }),
          catchError((error) => {
            this.loggerService.error(error.message);
            return of(new usersActions.LoadUsersFail(error));
          })
        );
      })
    )
  );

  public suspendUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.SUSPEND_USER),
      switchMap((user: usersActions.SuspendUser) => {
        return this.usersService.suspendUser(user).pipe(
          map(() => new usersActions.SuspendUserSuccess(user.payload)),
          catchError((error) => of(new usersActions.SuspendUserFail(error)))
        );
      })
    )
  );

  public inviteNewUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.INVITE_NEW_USER),
      map(() => new fromRoot.Go({ path: ['users/invite-user'] }))
    )
  );

  public reinviteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.REINVITE_PENDING_USER),
      map(() => new fromRoot.Go({ path: ['users/invite-user'] }))
    )
  );
}
