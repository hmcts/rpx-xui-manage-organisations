import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as authActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {UserService} from '../../services/user.service';
import {AuthActionTypes} from '../actions/';
import {UserInterface} from '../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import {AcceptTcService} from '../../../accept-tc/services/accept-tc.service';
import * as usersActions from '../../../user-profile/store/';
import * as fromRoot from '../../../app/store'

@Injectable()
export class UserProfileEffects {
  constructor(
    private actions$: Actions,
    private authService: UserService,
    private acceptTcService: AcceptTcService
  ) { }

  @Effect()
  getUser$ = this.actions$.pipe(
    ofType(AuthActionTypes.GET_USER_DETAILS),
    switchMap(() => {
      return this.authService.getUserDetails()
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
  loadHasAccepted$ = this.actions$.pipe(
    ofType(AuthActionTypes.LOAD_HAS_ACCEPTED_TC),
    switchMap((action: any) => {
      return this.acceptTcService.getHasUserAccepted(action.payload).pipe(
        map(tcDetails => {
          return new authActions.LoadHasAcceptedTCSuccess(tcDetails.toString());
        }),
        catchError(error => of(new authActions.LoadHasAcceptedTCFail(error)))
      );
    })
  );


}


