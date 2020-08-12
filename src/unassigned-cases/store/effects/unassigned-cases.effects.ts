import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoggerService } from '../../../shared/services/logger.service';
import { UnassignedCasesService } from '../../services/unassigned-cases.service';
import { UnassingedCasesUtil } from '../../util/unassigned-cases.util';
import { LOAD_UNASSIGNED_CASE_TYPES,
  LOAD_UNASSIGNED_CASES,
  LoadUnassignedCasesFailure,
  LoadUnassignedCasesSuccess,
  LoadUnassignedCaseTypesFailure,
  LoadUnassignedCaseTypesSuccess } from '../actions/unassigned-cases.actions';

@Injectable()
export class UnassignedCasesEffects {
    constructor(private readonly actions$: Actions,
                private readonly service: UnassignedCasesService,
                private readonly loggerService: LoggerService) { }

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

  public static onLoadUnassignedCases(payload: any, service: UnassignedCasesService, loggerService: LoggerService): Observable<any> {
    return service.fetchUnassignedCases().pipe(
      map(unassignedCases => new LoadUnassignedCasesSuccess(unassignedCases)),
      catchError(errorResponse => {
        loggerService.error(errorResponse);
        return of(new LoadUnassignedCasesFailure(errorResponse.error));
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
