import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store/index';
import { LoggerService } from '../../../shared/services/logger.service';
import { CaaCasesService } from '../../services/caa-cases.service';
import { CaaCasesUtil } from '../../util/caa-cases.util';
import {
  LoadAssignedCasesFailure, LoadAssignedCasesSuccess, LoadAssignedCaseTypesFailure, LoadAssignedCaseTypesSuccess,
  LoadUnassignedCasesFailure, LoadUnassignedCasesSuccess, LoadUnassignedCaseTypesFailure, LoadUnassignedCaseTypesSuccess,
  LOAD_ASSIGNED_CASES, LOAD_ASSIGNED_CASE_TYPES, LOAD_UNASSIGNED_CASES, LOAD_UNASSIGNED_CASE_TYPES
} from '../actions/caa-cases.actions';

@Injectable()
export class CaaCasesEffects {
  constructor(private readonly actions$: Actions,
              private readonly caaCasesService: CaaCasesService,
              private readonly loggerService: LoggerService) {
  }

  @Effect()
  public loadAssignedCases$ = this.actions$.pipe(
    ofType(LOAD_ASSIGNED_CASES),
    switchMap((payload: any) => {
      return this.caaCasesService.getCaaCases(payload.caseType, payload.pageNo, payload.pageSize).pipe(
        map(caaCases => new LoadAssignedCasesSuccess(caaCases)),
        catchError(errorResponse => {
          this.loggerService.error(errorResponse);
          return errorResponse.error.status === 400
            ? of(new LoadAssignedCasesFailure(errorResponse.error))
            : of(new fromRoot.Go({ path: ['/service-down']}));
        })
      );
    })
  );

  @Effect()
  public loadUnassignedCases$ = this.actions$.pipe(
    ofType(LOAD_UNASSIGNED_CASES),
    switchMap((payload: any) => {
      return this.caaCasesService.getCaaCases(payload.caseType, payload.pageNo, payload.pageSize).pipe(
        map(caaCases => new LoadUnassignedCasesSuccess(caaCases)),
        catchError(errorResponse => {
          this.loggerService.error(errorResponse);
          return errorResponse.error.status === 400
            ? of(new LoadUnassignedCasesFailure(errorResponse.error))
            : of(new fromRoot.Go({ path: ['/service-down']}));
        })
      );
    })
  );

  @Effect()
  public loadAssignedCaseTypes$ = this.actions$.pipe(
    ofType(LOAD_ASSIGNED_CASE_TYPES),
    switchMap((payload: any) => {
      return this.caaCasesService.getCaaCaseTypes().pipe(
        map(caaCaseTypes => {
          const navItems = CaaCasesUtil.getCaaNavItems(caaCaseTypes);
          return new LoadAssignedCaseTypesSuccess(navItems);
        }),
        catchError(errorResponse => {
          this.loggerService.error(errorResponse);
          return of(new LoadAssignedCaseTypesFailure(errorResponse.error));
        })
      );
    })
  );

  @Effect()
  public loadUnassignedCaseTypes$ = this.actions$.pipe(
    ofType(LOAD_UNASSIGNED_CASE_TYPES),
    switchMap((payload: any) => {
      return this.caaCasesService.getCaaCaseTypes().pipe(
        map(caaCaseTypes => {
          const navItems = CaaCasesUtil.getCaaNavItems(caaCaseTypes);
          return new LoadUnassignedCaseTypesSuccess(navItems);
        }),
        catchError(errorResponse => {
          this.loggerService.error(errorResponse);
          return of(new LoadUnassignedCaseTypesFailure(errorResponse.error));
        })
      );
    })
  );
}
