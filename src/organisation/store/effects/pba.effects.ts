import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store/index';
import { PBAService } from '../../services/pba.service';
import * as organisationActions from '../actions';

@Injectable()
export class PBAEffects {
  public payload: any;
  constructor(
    private actions$: Actions,
    private pbaService: PBAService,
    private router: Router,
  ) { }

  @Effect()
  public updatePBAs$ = this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_PBAS),
    map((action: organisationActions.OrganisationUpdatePBAs) => action.payload),
    switchMap(payload => {
      this.payload = payload;
      return this.pbaService.updatePBAs(payload).pipe(
        map(
          (response) => new organisationActions.OrganisationUpdatePBAResponse(response)),
        catchError(() => of(new fromRoot.Go({ path: ['/service-down']})))
      );
    })
  );

  @Effect({ dispatch: false })
  public updatePBAsAndNavigate$ = this.actions$.pipe(
    ofType(organisationActions.ORGANISATION_UPDATE_PBA_RESPONSE),
    tap((action) => this.router.navigate(['/organisation']))
  );
}
