import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { Action } from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import { LoggerService } from 'src/shared/services/logger.service';
import * as fromRoot from '../../../app/store';
import {InviteUserService } from '../../services';
import * as usersActions from '../actions';
import { ErrorReport } from 'src/users/models/errorReport.model';

@Injectable()
export class InviteUserEffects {
  constructor(
    private actions$: Actions,
    private inviteUserSevice: InviteUserService,
    private loggerService: LoggerService
  ) {}

  @Effect()
  saveUser$ = this.actions$.pipe(
    ofType(usersActions.SEND_INVITE_USER),
    map((action: usersActions.SendInviteUser) => action.payload),
    switchMap((inviteUserFormData) => {
      const userEmail = (inviteUserFormData as any).email;
      return this.inviteUserSevice.inviteUser(inviteUserFormData).pipe(
        map(userDetails => new usersActions.InviteUserSuccess({...userDetails, userEmail})),
        tap(() => this.loggerService.info('User Invited')),
        catchError(error => {
          this.loggerService.error(error.message);
          return of(new usersActions.InviteUserFail(error));
        })
      );
    })
  );

  @Effect()
  confirmUser$ = this.actions$.pipe(
    ofType(usersActions.INVITE_USER_SUCCESS),
    map(() => {
      return new fromRoot.Go({ path: ['users/invite-user-success'] });
    })
  );

  public static getErrorAction(error: ErrorReport): Action {
    switch (error.apiStatusCode) {
      case 400:
      case 401:
      case 402:
      case 403:
      case 405:
        return new usersActions.InviteUserFailWith400(error);
      case 404:
        return new usersActions.InviteUserFailWith404(error);
      case 429:
        return new usersActions.InviteUserFailWith429(error);
      case 500:
        return new usersActions.InviteUserFailWith500(error);
      default:
          return new usersActions.InviteUserFail(error);
    }
  }
}
