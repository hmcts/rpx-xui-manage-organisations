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

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authService: UserService
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
      if (error) {
        console.log(error);
      }
      console.log('_________no user details returned');
      // let API_BASE_URL = window.location.protocol + '//' + window.location.hostname;
      // API_BASE_URL += window.location.port ? ':' + window.location.port : '';
      //
      // const base = config.services.idamWeb;
      // const clientId = config.idamClient;
      // const callback = `${API_BASE_URL}${config.oauthCallbackUrl}`;
      // window.location.href = `${base}?response_type=code&client_id=${clientId}&redirect_uri=${callback}`;
    })
  );

}


