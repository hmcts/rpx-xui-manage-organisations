import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as authActions from '../actions';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
import {UserService} from '../../services/user.service';
import {AuthActionTypes} from '../actions/';
import {UserInterface} from '../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import { LoggerService } from '../../../shared/services/logger.service';
import * as appActions from '../../../app/store/actions';
import {LogOutKeepAliveService} from '../../../shared/services/keep-alive/keep-alive.services';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authService: UserService,
    private loggerService: LoggerService,
    private logOutService: LogOutKeepAliveService,
  ) { }

  @Effect()
  getUser$ = this.actions$.pipe(
    ofType(AuthActionTypes.GET_USER_DETAILS),
    switchMap(() => {
      return this.authService.getUserDetails()
        .pipe(
          map((userDetails: UserInterface) => new authActions.GetUserDetailsSuccess(userDetails)),
          catchError((error: HttpErrorResponse) => {
            this.loggerService.error(error.message);
            return of(new authActions.GetUserDetailsFailure(error));
          })
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
  sigout$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.SIGNED_OUT),
    switchMap(() => {
      return this.logOutService.logOut().pipe(
        map(() => new authActions.SignedOutSuccess())
      );
    })
  );

  @Effect()
  signedOutSuccess$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.SIGNED_OUT_SUCCESS),
    mergeMap(() => {
      return [
        new appActions.Go({path: ['/signed-out']}),
        new appActions.SetUserRoles([]) // needed to remove navigation from signed-out page
      ]
    })
  );

  @Effect({ dispatch: false})
  keepAlive$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.KEEP_ALIVE),
    switchMap((date) => {
      return this.logOutService.heartBeat()
        ;
    })
  );

}


