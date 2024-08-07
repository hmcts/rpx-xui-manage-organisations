import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store';
import { LoggerService } from '../../../shared/services/logger.service';
import { ErrorReport } from '../../models/errorReport.model';
import { InviteUserService } from '../../services';
import * as usersActions from '../actions';

@Injectable()
export class InviteUserEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly inviteUserSevice: InviteUserService,
    private readonly loggerService: LoggerService
  ) {}

  public saveUser$ = createEffect(() => this.actions$.pipe(
    ofType(usersActions.SEND_INVITE_USER),
    map((action: usersActions.SendInviteUser) => action.payload),
    switchMap((inviteUserFormData) => {
      const userEmail = (inviteUserFormData as any).email;
      return this.inviteUserSevice.inviteUser(inviteUserFormData).pipe(
        map((userDetails) => {
          const userInvitedLoggerMessage = InviteUserEffects.getUserInviteLoggerMessage(inviteUserFormData.resendInvite);
          this.loggerService.info(userInvitedLoggerMessage);
          return new usersActions.InviteUserSuccess({ ...userDetails, userEmail });
        }),
        catchError((errorReport) => {
          this.loggerService.error(errorReport.message);
          const action = InviteUserEffects.getErrorAction(errorReport.error);
          return of(action);
        })
      );
    })
  ));

  public confirmUser$ = createEffect(() => this.actions$.pipe(
    ofType(usersActions.INVITE_USER_SUCCESS),
    map(() => {
      return new fromRoot.Go({ path: ['users/invite-user-success'] });
    })
  ));

  public static getUserInviteLoggerMessage(resendInvite: boolean) {
    return resendInvite ? 'User Re-Invited' : 'User Invited';
  }

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
      case 409:
        return new usersActions.InviteUserFailWith409(error);
      case 429:
        return new usersActions.InviteUserFailWith429(error);
      case 500:
        return new usersActions.InviteUserFailWith500(error);
      default:
        return new usersActions.InviteUserFail(error);
    }
  }
}
