import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as authActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {UserService} from '../../services/user.service';
import {AuthActionTypes} from '../actions/';
import {UserInterface} from '../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import config from '../../../../api/lib/config';
import * as usersActions from '../../../users/store/actions/user.actions';
import { UserRolesUtil } from 'src/users/containers/utils/user-roles-util';
import * as fromRoot from '../../../app/store';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
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
            return new usersActions.EditUserSuccess(user.userId);
          } else {
            return new usersActions.EditUserFailure(user.userId);
          }
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
      new usersActions.LoadUsers(),
      new fromRoot.Go({ path: [`users/user/${userId}`] })
  ])
  );
}
