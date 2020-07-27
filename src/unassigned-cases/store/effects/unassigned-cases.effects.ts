import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoggerService } from 'src/shared/services/logger.service';
import { UnassignedCasesService } from 'src/unassigned-cases/services/unassigned-cases.service';
import { LOAD_UNASSIGNED_CASES, LoadUnassignedCasesFailure, LoadUnassignedCasesSuccess } from '../actions/unassigned-cases.actions';

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

  public static onLoadUnassignedCases(payload: any, service: UnassignedCasesService, loggerService: LoggerService): Observable<any> {
    return service.fetchUnassignedCases().pipe(
      map(unassignedCases => new LoadUnassignedCasesSuccess(unassignedCases)),
      catchError(errorResponse => {
        loggerService.error(errorResponse);
        return of(new LoadUnassignedCasesFailure(errorResponse.error));
      })
    );
  }
}
