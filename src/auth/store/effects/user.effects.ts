import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as authActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {UserService} from '../../services/user.service';
import {AuthActionTypes} from '../actions/auth.actions';
import {UserInterface} from '../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';



@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authService: UserService
  ) { }


  @Effect()
  getUser$ = this.actions$.pipe(
    ofType(AuthActionTypes.USER),
    switchMap(() => {
      return this.authService.getUserDetails()
        .pipe(
          map((userDetails: UserInterface) => new authActions.GetUserDetailsSuccess(userDetails)),
          catchError((error: HttpErrorResponse) => of(new authActions.GetUserDetailsFailure(error)))
        );
    })
  );
}


