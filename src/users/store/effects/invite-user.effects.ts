import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import * as usersActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {InviteUserService, JurisdictionService } from '../../services';
import * as fromRoot from '../../../app/store';


@Injectable()
export class InviteUserEffects {
  constructor(
    private actions$: Actions,
    private inviteUserSevice: InviteUserService,
    private jurisdictionService: JurisdictionService
  ) {}

  @Effect()
  saveUser$ = this.actions$.pipe(
    ofType(usersActions.SEND_INVITE_USER),
    map((action: usersActions.SendInviteUser) => action.payload),
    switchMap((inviteUserFormData) => {
      return this.inviteUserSevice.inviteUser(inviteUserFormData).pipe(
        map(userDetails => new usersActions.InviteUserSuccess(userDetails)),
        catchError(error => of(new usersActions.InviteUserFail(error)))
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

  @Effect()
  loadJuridictions$ = this.actions$.pipe(
    ofType(usersActions.LOAD_JURISDICTIONS_FOR_USER),
    switchMap(() => {
      return this.jurisdictionService.getJurisdictions().pipe(
        map(jurisdictions => new usersActions.LoadJurisdictionsForUserSuccess(jurisdictions)),
        catchError(error => of(new usersActions.LoadJurisdictionsForUserFail(error)))
      );
    })
  );
}
