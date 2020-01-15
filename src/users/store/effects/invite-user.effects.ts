import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as usersActions from '../actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {InviteUserService } from '../../services';
import * as fromRoot from '../../../app/store';
<<<<<<< HEAD
import { LoggerService } from 'src/shared/services/logger.service';
import { UserService } from 'src/user-profile/services/user.service';
=======
import { LoggerService } from '../../../shared/services/logger.service';

>>>>>>> 5c7f86a1f0b68ad3a23c6ab8a0e2496080c7e850

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


}
