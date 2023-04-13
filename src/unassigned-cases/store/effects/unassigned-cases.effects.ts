import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store/index';
import { LoggerService } from '../../../shared/services/logger.service';
import { UnassignedCasesService } from '../../services/unassigned-cases.service';
import { UnassingedCasesUtil } from '../../util/unassigned-cases.util';
import {
  LoadUnassignedCasesFailure,
  LoadUnassignedCasesSuccess,
  LoadUnassignedCaseTypesFailure,
  LoadUnassignedCaseTypesSuccess,
  LOAD_UNASSIGNED_CASES,
  LOAD_UNASSIGNED_CASE_TYPES
} from '../actions/unassigned-cases.actions';

@Injectable()
export class UnassignedCasesEffects {
  constructor(private readonly actions$: Actions,
              private readonly service: UnassignedCasesService,
              private readonly loggerService: LoggerService) {}

  @Effect()
  public loadUnassignedCases$ = this.actions$.pipe(
    ofType(LOAD_UNASSIGNED_CASES),
    switchMap((payload: any) => {
        return UnassignedCasesEffects.onLoadUnassignedCases(payload, this.service, this.loggerService);
      })
  );

  @Effect()
  public loadUnassignedCaseTypes$ = this.actions$.pipe(
    ofType(LOAD_UNASSIGNED_CASE_TYPES),
    switchMap((payload: any) => {
        return UnassignedCasesEffects.onLoadUnassignedCaseTypes(payload, this.service, this.loggerService);
      })
  );

  public static onLoadUnassignedCases(action: any, service: UnassignedCasesService, loggerService: LoggerService): Observable<any> {
    return service.fetchUnassignedCases(action.payload.caseType, action.payload.pageNo, action.payload.pageSize).pipe(
      map(unassignedCases => new LoadUnassignedCasesSuccess(unassignedCases)),
      catchError(async (errorResponse) => {
        loggerService.error(errorResponse);
        if (errorResponse.error.status === 400) {
          return new LoadUnassignedCasesFailure(errorResponse.error);
        } else {
          return new fromRoot.Go({ path: ['/service-down']});
        }
      })
    );
  }

  public static onLoadUnassignedCaseTypes(payload: any, service: UnassignedCasesService, loggerService: LoggerService): Observable<any> {
    return service.fetchUnassignedCaseTypes().pipe(
      map(unassignedCaseTypes => {
        const navItems = UnassingedCasesUtil.getNavUnassignedNavItems(unassignedCaseTypes);
        return new LoadUnassignedCaseTypesSuccess(navItems);
      }),
      catchError(errorResponse => {
        loggerService.error(errorResponse);
        return of(new LoadUnassignedCaseTypesFailure(errorResponse.error));
      })
    );
  }
}
