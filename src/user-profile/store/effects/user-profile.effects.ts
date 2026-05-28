import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserRolesUtil } from 'src/users/containers/utils/user-roles-util';
import { AcceptTcService } from '../../../accept-tc/services/accept-tc.service';
import { LoggerService } from '../../../shared/services/logger.service';
import * as usersActions from '../../../users/store/actions/user.actions';
import { UserInterface } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import * as authActions from '../actions';
import { AuthActionTypes } from '../actions/';
import { SessionStorageService } from '../../../shared/services/session-storage.service';

@Injectable()
export class UserProfileEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
    private readonly authService: UserService,
    private readonly acceptTcService: AcceptTcService,
    private readonly sessionStorageService: SessionStorageService
  ) {}

  public getUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActionTypes.GET_USER_DETAILS),
    switchMap(() => {
      return this.userService.getUserDetails()
        .pipe(
          map((userDetails: UserInterface) => {
            this.sessionStorageService.setItem('userDetails', JSON.stringify(userDetails));
            return new authActions.GetUserDetailsSuccess(userDetails);
          }),
          catchError((error: HttpErrorResponse) => {
            this.loggerService.error(error.message);
            return of(new authActions.GetUserDetailsFailure(error));
          })
        );
    })
  ));

  public getUserFail$ = createEffect(() => this.actions$.pipe(
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
        roles: ['pui-case-manager', 'pui-user-manager', 'pui-finance-manager', 'pui-organisation-manager'],
        sessionTimeout: {
          idleModalDisplayTime: 10,
          totalIdleTime: 50
        },
        userId: '1'
      };
      return new authActions.GetUserDetailsSuccess(hadCodedUser);
    })
  ));

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
   *
   * Additionally, a 500 status code is now returned within the statusUpdateResponse object if the API fails to update the user's access types.
   */
  public editUser$ = createEffect(() => this.actions$.pipe(
    ofType(usersActions.EDIT_USER),
    switchMap(({ payload, orgProfileIds }: usersActions.EditUser) => {
      const user = payload;
      const reqBody = orgProfileIds ? { userPayload: payload, orgIdsPayload: orgProfileIds } : payload;
      return this.userService.editUserPermissions(reqBody).pipe(
        map((response) => {
          if (UserRolesUtil.doesRoleAdditionExist(response)) {
            if (response.roleAdditionResponse.idamStatusCode !== '201') {
              return new usersActions.EditUserFailure(user.id);
            }
          }

          // Changes to access types populate the statusUpdateResponse object with a 500 if API fails
          if (response.statusUpdateResponse !== null && response.statusUpdateResponse.idamStatusCode === '500') {
            return new usersActions.EditUserFailure(user.id);
          }

          return new usersActions.EditUserSuccess(user.id);
        }),
        catchError((error) => {
          this.loggerService.error(error);
          return of(new usersActions.EditUserServerError({ userId: user.id, errorCode: error.apiStatusCode }));
        })
      );
    })
  )
  );

  public loadHasAccepted$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActionTypes.LOAD_HAS_ACCEPTED_TC),
    switchMap((action: any) => {
      return this.acceptTcService.getHasUserAccepted(action.payload).pipe(
        map((tcDetails) => new authActions.LoadHasAcceptedTCSuccess(tcDetails.toString())),
        catchError((error) => of(new authActions.LoadHasAcceptedTCFail(error)))
      );
    })
  ));

  public acceptTandC$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActionTypes.ACCEPT_T_AND_C),
    map((action: authActions.AcceptTandC) => action.payload),
    switchMap((userData) => {
      return this.acceptTcService.acceptTandC(userData).pipe(
        map((tcDetails) => {
          return new authActions.AcceptTandCSuccess(tcDetails);
        }),
        catchError((error) => of(new authActions.AcceptTandCFail(error)))
      );
    })
  ));

  public confirmEditUser$ = createEffect(() => this.actions$.pipe(
    ofType(usersActions.EDIT_USER_SUCCESS),
    map((user: any) => {
      return user.payload; // this is the userId
    }),
    switchMap(() => [
      new usersActions.LoadAllUsers()
    ])
  ));
}
