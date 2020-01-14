import {HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {AcceptTcService} from '../../../accept-tc/services/accept-tc.service';
import { LoggerService } from '../../../shared/services/logger.service';
import {UserInterface} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import * as authActions from '../actions';
import {AuthActionTypes} from '../actions/';

@Injectable()
export class UserProfileEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly authService: UserService,
    private readonly acceptTcService: AcceptTcService,
    private readonly loggerService: LoggerService
  ) { }

  @Effect()
  public getUser$ = this.actions$.pipe(
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
        userId: '1'
      };
      return new authActions.GetUserDetailsSuccess(hadCodedUser);
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


}


