import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store/index';
import { LoggerService } from '../../../shared/services/logger.service';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import { CaaCasesService } from '../../services/caa-cases.service';
import { CaaCasesUtil } from '../../util/caa-cases.util';
import * as fromCaaActions from '../actions/caa-cases.actions';

@Injectable()
export class CaaCasesEffects {
  constructor(private readonly actions$: Actions,
              private readonly caaCasesService: CaaCasesService,
              private readonly loggerService: LoggerService) {
  }

  public loadAssignedCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCaaActions.LOAD_ASSIGNED_CASES),
      switchMap((action: fromCaaActions.LoadAssignedCases) => {
        const payload = action.payload;
        console.log('load assigned cases');
        return this.caaCasesService.getCaaCases(payload.caseType, payload.pageNo, payload.pageSize, CaaCasesPageType.AssignedCases, payload.caaCasesFilterType, payload.caaCasesFilterValue).pipe(
          map((caaCases) => new fromCaaActions.LoadAssignedCasesSuccess(caaCases)),
          catchError((error) => CaaCasesEffects.handleError(error, this.loggerService, CaaCasesPageType.AssignedCases))
        );
      })
    )
  );

  public loadUnassignedCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCaaActions.LOAD_UNASSIGNED_CASES),
      switchMap((action: fromCaaActions.LoadUnassignedCases) => {
        const payload = action.payload;
        return this.caaCasesService.getCaaCases(payload.caseType, payload.pageNo, payload.pageSize, CaaCasesPageType.UnassignedCases, payload.caaCasesFilterType, payload.caaCasesFilterValue).pipe(
          map((caaCases) => new fromCaaActions.LoadUnassignedCasesSuccess(caaCases)),
          catchError((error) => CaaCasesEffects.handleError(error, this.loggerService, CaaCasesPageType.UnassignedCases))
        );
      })
    )
  );

  public loadCaseTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCaaActions.LOAD_CASE_TYPES),
      switchMap((action: fromCaaActions.LoadCaseTypes) => {
        const payload = action.payload;
        return this.caaCasesService.getCaaCaseTypes(payload.caaCasesPageType, payload.caaCasesFilterType, payload.caaCasesFilterValue).pipe(
          map((caaCaseTypes) => {
            const navItems = CaaCasesUtil.getCaaNavItems(caaCaseTypes);
            return new fromCaaActions.LoadCaseTypesSuccess(navItems);
          }),
          catchError((error) => {
            this.loggerService.error(error);
            return of(new fromCaaActions.LoadCaseTypesFailure(error));
          })
        );
      })
    )
  );

  public static handleError(error: HttpErrorResponse, loggerService: LoggerService, caaCasesPageType: string): Observable<Action> {
    loggerService.error(error);
    return error.status === 400
      ? caaCasesPageType === CaaCasesPageType.UnassignedCases
        ? of(new fromCaaActions.LoadUnassignedCasesFailure(error))
        : of(new fromCaaActions.LoadAssignedCasesFailure(error))
      : of(new fromRoot.Go({ path: ['/service-down'] }));
  }
}
