import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as logInActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {LoginService} from '../../services';



@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private loginService: LoginService
  ) {}

  @Effect()
  logIn$ = this.actions$.pipe(
    ofType(logInActions.LOGIN_USER),
    map((action: logInActions.LoginUser) => action.payload),
    switchMap((userCredential) => {
      return this.loginService.loginUser(userCredential).pipe(
        map(userDetals => new logInActions.LoginUserSuccess(userDetals)),
        catchError(error => of(new logInActions.LoginUserFail(error)))
      );
    })
  );
}
