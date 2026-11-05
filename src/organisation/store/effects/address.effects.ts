import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import * as organisationActions from '../actions';

@Injectable()
export class AddressEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly organisationService: OrganisationService,
    private readonly router: Router,
    private readonly loggerService: LoggerService
  ) {}

  public updateAddress$ = createEffect(() => this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_ADDRESS),
    switchMap((action: organisationActions.OrganisationUpdateAddress) =>
      this.organisationService.updateAddress().pipe(
        take(1),
        map(() => new organisationActions.OrganisationUpdateAddressSuccess(action.payload)),
        catchError((error) => {
          this.loggerService.error(error?.message || 'Unable to update organisation address');
          return of(new organisationActions.OrganisationUpdateAddressError(error));
        })
      )
    )
  ));

  public updateAddressAndNavigate$ = createEffect(() => this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_ADDRESS_SUCCESS),
    tap(() => this.router.navigate(['/organisation']))
  ), { dispatch: false });
}
