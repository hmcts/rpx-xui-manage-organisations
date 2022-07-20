import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store/index';
import { LoggerService } from '../../../shared/services/logger.service';
import { CaaCasesService } from '../../services/caa-cases.service';
import { CaaCasesUtil } from '../../util/caa-cases.util';
import * as fromCaaActions from '../actions/caa-cases.actions';

@Injectable()
export class CaaCasesEffects {
  constructor(private readonly actions$: Actions,
              private readonly caaCasesService: CaaCasesService,
              private readonly loggerService: LoggerService) {
  }

  @Effect()
  public loadAssignedCases$ = this.actions$.pipe(
    ofType(fromCaaActions.LOAD_ASSIGNED_CASES),
    switchMap((action: fromCaaActions.LoadAssignedCases) => {
      return this.caaCasesService.getCaaCases(action.payload.caseType, action.payload.pageNo, action.payload.pageSize).pipe(
        map(caaCases => new fromCaaActions.LoadAssignedCasesSuccess(caaCases)),
        catchError(errorResponse => {
          this.loggerService.error(errorResponse);
          return errorResponse.error.status === 400
            ? of(new fromCaaActions.LoadAssignedCasesFailure(errorResponse.error))
            : of(new fromRoot.Go({ path: ['/service-down']}));
        })
      );
    })
  );

  @Effect()
  public loadUnassignedCases$ = this.actions$.pipe(
    ofType(fromCaaActions.LOAD_UNASSIGNED_CASES),
    switchMap((action: fromCaaActions.LoadUnassignedCases) => {
      return this.caaCasesService.getCaaCases(action.payload.caseType, action.payload.pageNo, action.payload.pageSize).pipe(
        map(caaCases => new fromCaaActions.LoadUnassignedCasesSuccess(caaCases)),
        catchError(errorResponse => {
          this.loggerService.error(errorResponse);
          return errorResponse.error.status === 400
            ? of(new fromCaaActions.LoadUnassignedCasesFailure(errorResponse.error))
            : of(new fromRoot.Go({ path: ['/service-down']}));
        })
      );
    })
  );

  @Effect()
  public loadCaseTypes$ = this.actions$.pipe(
    ofType(fromCaaActions.LOAD_CASE_TYPES),
    switchMap((action: fromCaaActions.LoadCaseTypes) => {
      return this.caaCasesService.getCaaCaseTypes().pipe(
        map(caaCaseTypes => {
          const navItems = CaaCasesUtil.getCaaNavItems(caaCaseTypes);
          return new fromCaaActions.LoadCaseTypesSuccess(navItems);
        }),
        catchError(errorResponse => {
          this.loggerService.error(errorResponse);
          return of(new fromCaaActions.LoadCaseTypesFailure(errorResponse.error));
        })
      );
    })
  );
}
