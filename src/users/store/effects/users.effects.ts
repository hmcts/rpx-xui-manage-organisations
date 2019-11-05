import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as usersActions from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UsersService } from '../../services';



@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService
  ) { }

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType(usersActions.LOAD_USERS),
    switchMap(() => {
      return this.usersService.getListOfUsers().pipe(
        map(userDetails => {
          const amendedUsers = [];
          userDetails.users.forEach(element => {
              const fullName = element.firstName + ' ' + element.lastName;
              const user = element;
              user.fullName = fullName;
              if (user.idamStatus !== 'PENDING') {
                user.routerLink = 'user/' + user.userIdentifier;
              }
              amendedUsers.push(user);
          });

          return new usersActions.LoadUsersSuccess({users: amendedUsers});
        }),
        catchError(error => of(new usersActions.LoadUsersFail(error)))
      );
    })
  );
}
