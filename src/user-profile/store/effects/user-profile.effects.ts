import {HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserRolesUtil } from 'src/users/containers/utils/user-roles-util';
import config from '../../../../api/lib/config';
import {AcceptTcService} from '../../../accept-tc/services/accept-tc.service';
import * as fromRoot from '../../../app/store';
import { LoggerService } from '../../../shared/services/logger.service';
import * as usersActions from '../../../users/store/actions/user.actions';
import {UserInterface} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import * as authActions from '../actions';
import {AuthActionTypes} from '../actions/';

@Injectable()
export class UserProfileEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
    private readonly authService: UserService,
    private readonly acceptTcService: AcceptTcService
  ) { }

  @Effect()
  public getUser$ = this.actions$.pipe(
    ofType(AuthActionTypes.GET_USER_DETAILS),
    switchMap(() => {
      return this.userService.getUserDetails()
        .pipe(
          map((userDetails: UserInterface) => {
            console.log('userDetails from the node layer');
            console.log(userDetails);
            return new authActions.GetUserDetailsSuccess(userDetails)
          }),
          catchError((error: HttpErrorResponse) => {
            this.loggerService.error(error.message);
            return of(new authActions.GetUserDetailsFailure(error));
          })
        );
    })
  );

  // TODO: Not sure why a hard coded user is needed here
  @Effect()
  public getUserFail$ = this.actions$.pipe(
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
        sessionTimeout: {
          idleModalDisplayTime: 2,
          totalIdleTime: 600000
        },
        userId: '1',
      };
      return new authActions.GetUserDetailsSuccess(hadCodedUser);
    })
  );

  /**
   * Edit User Effect
   *
   * We proxy through the Node layer to edit a User's permissions. The call is proxy'ed onto the PRD 3rd party service.
   *
   * If PRD returns a 201 or 204 on successfully adding a User's permission we display the Edit Permissions page
   * with the updated User's permissions.
   *
   * If PRD does not return a 201 or 204, then we show a permissions updated failure page. The permissions update failure
   * page allows the logged in User to retry editing permissions by showing them a link taking them back to the
   * Edit Permissions page.
   */
  @Effect()
  public editUser$ = this.actions$.pipe(
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
  public loadHasAccepted$ = this.actions$.pipe(
    ofType(AuthActionTypes.LOAD_HAS_ACCEPTED_TC),
    switchMap((action: any) => {
      return this.acceptTcService.getHasUserAccepted(action.payload).pipe(
        map(tcDetails => new authActions.LoadHasAcceptedTCSuccess(tcDetails.toString())),
        catchError(error => of(new authActions.LoadHasAcceptedTCFail(error)))
      );
    })
  );

  @Effect()
  public acceptTandC$ = this.actions$.pipe(
    ofType(AuthActionTypes.ACCEPT_T_AND_C),
    map((action: authActions.AcceptTandC) => action.payload),
    switchMap((userData) => {
      return this.acceptTcService.acceptTandC(userData).pipe(
        map(tcDetails => {
          return new authActions.AcceptTandCSuccess(tcDetails);
        }),
        catchError(error => of(new authActions.AcceptTandCFail(error)))
      );
    })
  );

  @Effect()
  public confirmEditUser$ = this.actions$.pipe(
    ofType(usersActions.EDIT_USER_SUCCESS),
    map((user: any) => {
      return user.payload; // this is the userId
    }),
    switchMap(userId => [
      new usersActions.LoadUsers()
  ])
  );

}
