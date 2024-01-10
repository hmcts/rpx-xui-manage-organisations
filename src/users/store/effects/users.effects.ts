import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, take } from 'rxjs/operators';
import * as fromRoot from '../../../app/store';
import { LoggerService } from '../../../shared/services/logger.service';
import { UsersService } from '../../services';
import * as usersActions from '../actions';
import * as orgActions from '../../../organisation/store/actions';
import { PrdUser } from 'src/users/models/prd-users.model';
import { Store, select } from '@ngrx/store';

@Injectable()
export class UsersEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly usersService: UsersService,
    private readonly loggerService: LoggerService,
    private readonly appStore: Store<fromRoot.State>,
  ) {}

  public loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.LOAD_USERS),
      switchMap((action: any) => {
        return this.usersService.getListOfUsers(action.payload).pipe(
          concatMap((userDetails) => {
            const amendedUsers: PrdUser[] = [];
            let organisationProfileIds = [];
            userDetails.users.forEach((element) => {
              const fullName = `${element.firstName} ${element.lastName}`;
              const accessTypes = element?.accessTypes || [];
              const user: PrdUser = {
                ...element,
                fullName: `${element.firstName} ${element.lastName}`,
                routerLink: `user/${element.userIdentifier}`,
                routerLinkTitle: `User details for ${fullName} with id ${element.userIdentifier}`,
                accessTypes: accessTypes
              };
              amendedUsers.push(user);
              user.accessTypes = user?.accessTypes || [];
              organisationProfileIds = [
                ...organisationProfileIds,
                ...user.accessTypes.map(
                  (accessType) => accessType.organisationProfileId
                )
              ];
            });

            organisationProfileIds = [...new Set(organisationProfileIds)];
            return [
              new orgActions.OrganisationUpdateUpdateProfileIds(
                organisationProfileIds
              ),
              new usersActions.LoadUsersSuccess({ users: amendedUsers })
            ];
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

  public loadAllUsersNoRoleData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.LOAD_ALL_USERS_NO_ROLE_DATA),
      switchMap(() => {
        return this.usersService.getAllUsersList().pipe(
          concatMap((userDetails) => {
            const amendedUsers: PrdUser[] = [];
            let organisationProfileIds = [];
            userDetails.users.forEach((element) => {
              const fullName = `${element.firstName} ${element.lastName}`;
              const accessTypes = element?.accessTypes || [];
              const user: PrdUser = {
                ...element,
                fullName: `${element.firstName} ${element.lastName}`,
                routerLink: `user/${element.userIdentifier}`,
                routerLinkTitle: `User details for ${fullName} with id ${element.userIdentifier}`,
                accessTypes: accessTypes
              };
              amendedUsers.push(user);
              user.accessTypes = user?.accessTypes || [];
              organisationProfileIds = [
                ...organisationProfileIds,
                ...user.accessTypes.map(
                  (accessType) => accessType.organisationProfileId
                )
              ];
            });

            organisationProfileIds = [...new Set(organisationProfileIds)];
            return [
              new orgActions.OrganisationUpdateUpdateProfileIds(
                organisationProfileIds
              ),
              new usersActions.LoadAllUsersNoRoleDataSuccess({ users: amendedUsers })
            ];
          }),
          catchError((error) => {
            this.loggerService.error(error.message);
            return of(new usersActions.LoadAllUsersNoRoleDataFail(error));
          })
        );
      })
    )
  );

  public loadUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.LOAD_USER_DETAILS),
      switchMap((action: any) => {
        return this.usersService
          .getUserDetailsWithPermission(action.payload)
          .pipe(
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
      switchMap(() => {
        return this.appStore.pipe(
          select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled),
          take(1),
          map((isEnabled) => {
            console.log('isEnabled', isEnabled);
            if (isEnabled) {
              return new fromRoot.Go({ path: ['users/manage'] });
            }
            return new fromRoot.Go({ path: ['users/invite-user'] });
          })
        );
      })
    )
  );

  public reinviteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.REINVITE_PENDING_USER),
      switchMap(() => {
        return this.appStore.pipe(
          select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled),
          take(1),
          map((isEnabled) => {
            if (isEnabled) {
              return new fromRoot.Go({ path: ['users/manage'] });
            }
            return new fromRoot.Go({ path: ['users/invite-user'] });
          })
        );
      })
    )
  );
}
