import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import * as organisationActions from '../actions';

@Injectable()
export class NameEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly organisationService: OrganisationService,
    private readonly router: Router,
    private readonly loggerService: LoggerService
  ) {}

  public updateName$ = createEffect(() => this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_NAME),
    switchMap((action: organisationActions.OrganisationUpdateName) =>
      this.organisationService.updateName().pipe(
        take(1),
        map(() => new organisationActions.OrganisationUpdateNameSuccess(action.payload)),
        catchError((error) => {
          this.loggerService.error(error?.message || 'Unable to update organisation name');
          return of(new organisationActions.OrganisationUpdateNameError(error));
        })
      )
    )
  ));

  public updateNameAndNavigate$ = createEffect(() => this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_NAME_SUCCESS),
    tap(() => {
      void this.router.navigate(['/organisation']);
    })
  ), { dispatch: false });
}
