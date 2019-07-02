import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as authActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {UserService} from '../../services/user.service';
import {AuthActionTypes} from '../actions/auth.actions';
import {UserInterface} from '../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';

import * as fromRoot from '../../../app/store';
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
    map(() => {
      return new fromRoot.Go({path: [this.generateLoginUrl()]});
    })
  );

  generateLoginUrl() {
    let API_BASE_URL = window.location.protocol + '//' + window.location.hostname;
    API_BASE_URL += window.location.port ? ':' + window.location.port : '';

    const base = config.services.idamWeb;
    const clientId = config.idamClient;
    const callback = `${API_BASE_URL}${config.oauthCallbackUrl}`;
    return `${base}?response_type=code&client_id=${clientId}&redirect_uri=${callback}`;
  }
}


