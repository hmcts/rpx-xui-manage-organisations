import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import * as organisationActions from '../actions';

@Injectable()
export class SraEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly organisationService: OrganisationService,
    private readonly router: Router,
    private readonly loggerService: LoggerService
  ) {}

  public updateSra$ = createEffect(() => this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_SRA),
    switchMap((action: organisationActions.OrganisationUpdateSra) =>
      this.organisationService.updateSra().pipe(
        take(1),
        map(() => new organisationActions.OrganisationUpdateSraSuccess(action.payload)),
        catchError((error) => {
          this.loggerService.error(error?.message || 'Unable to update organisation SRA ID');
          return of(new organisationActions.OrganisationUpdateSraError(error));
        })
      )
    )
  ));

  public updateSraAndNavigate$ = createEffect(() => this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_SRA_SUCCESS),
    tap(() => {
      void this.router.navigate(['/organisation']);
    })
  ), { dispatch: false });
}
