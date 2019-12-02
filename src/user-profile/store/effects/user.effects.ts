import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as authActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {UserService} from '../../services/user.service';
import {AuthActionTypes} from '../actions/';
import {UserInterface} from '../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import * as usersActions from '../../../users/store/actions/user.actions';
import { UserRolesUtil } from 'src/users/containers/utils/user-roles-util';
import { LoggerService } from 'src/shared/services/logger.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private loggerService: LoggerService
  ) { }

  @Effect()
  getUser$ = this.actions$.pipe(
    ofType(AuthActionTypes.GET_USER_DETAILS),
    switchMap(() => {
      return this.userService.getUserDetails()
        .pipe(
          map((userDetails: UserInterface) => new authActions.GetUserDetailsSuccess(userDetails)),
          catchError((error: HttpErrorResponse) => of(new authActions.GetUserDetailsFailure(error)))
        );
    })
  );

  @Effect()
  getUserFail$ = this.actions$.pipe(
    ofType(AuthActionTypes.GET_USER_DETAILS_FAIL),
    map((actions: authActions.GetUserDetailsFailure) => actions.payload),
    map((error) => {
      // TODO remove this when figure out why permissions are not returned by node on AAT
      if (error) {
        console.log(error);
      }
      console.log('_________no user details returned__________');
      const hadCodedUser = {
        email: 'hardcoded@user.com',
        orgId: '12345',
        roles: ['pui-case-manager', 'pui-user-manager', 'pui-finance-manager' , 'pui-organisation-manager'],
        userId: '1'
      };
      return new authActions.GetUserDetailsSuccess(hadCodedUser);
    })
  );

  @Effect()
  editUser$ = this.actions$.pipe(
    ofType(usersActions.EDIT_USER),
    map((action: usersActions.EditUser) => action.payload),
    switchMap((user) => {
      return this.userService.editUserPermissions(user).pipe(
        map( response => {
          if (UserRolesUtil.isAddingRoleSuccessful(response) || UserRolesUtil.isDeletingRoleSuccessful(response)) {
            this.loggerService.info('User permissions modified');
            return new usersActions.EditUserSuccess(user.userId);
          } else {
            this.loggerService.error('user permissions failed');
            return new usersActions.EditUserFailure(user.userId);
          }
        }),
        catchError(error => {
          this.loggerService.error(error);
          return of(new usersActions.EditUserServerError({userId: user.userId, errorCode: error.apiStatusCode}));
        })
      );
    })
  );

  @Effect()
  confirmEditUser$ = this.actions$.pipe(
    ofType(usersActions.EDIT_USER_SUCCESS),
    map((user: any) => {
      return user.payload; // this is the userId
    }),
    switchMap(userId => [
      new usersActions.LoadUsers()
  ])
  );
}
