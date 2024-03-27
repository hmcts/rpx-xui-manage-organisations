import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
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

  @Effect()
  public saveUser$ = this.actions$.pipe(
      ofType(usersActions.SEND_INVITE_USER),
      switchMap(({ payload, orgProfileIds }: usersActions.SendInviteUser) => {
        const reqBody = orgProfileIds ? { userPayload: payload, orgIdsPayload: orgProfileIds } : payload;
        const userEmail = payload.email;
        return this.inviteUserSevice.inviteUser(reqBody).pipe(
          map((userDetails) => {
            const userInvitedLoggerMessage = InviteUserEffects.getUserInviteLoggerMessage(payload.resendInvite);
            this.loggerService.info(userInvitedLoggerMessage);
            return new usersActions.InviteUserSuccess({ ...userDetails, userEmail });
          }),
          catchError((errorReport) => {
            this.loggerService.error(errorReport.message);
            return of(InviteUserEffects.getErrorAction(errorReport.error));
          })
        );
      })
    );

  @Effect()
  public confirmUser$ = this.actions$.pipe(
      ofType(usersActions.INVITE_USER_SUCCESS),
      map(() => {
        return new fromRoot.Go({ path: ['users/invite-user-success'] });
      })
    );

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
      case 422:
        return new usersActions.InviteUserFailWith422(error);
      case 429:
        return new usersActions.InviteUserFailWith429(error);
      case 500:
        return new usersActions.InviteUserFailWith500(error);
      default:
        return new usersActions.InviteUserFail(error);
    }
  }
}
