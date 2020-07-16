import {Injectable} from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoggerService } from 'src/shared/services/logger.service';
import { UnassignedCasesService } from 'src/unassigned-cases/services/unassigned-cases.service';
import { LOAD_UNASSINGED_CASES, LoadUnassignedCasesFailure, LoadUnassignedCasesSuccess } from '../actions/unassigned-cases.actions';

@Injectable()
export class UnassignedCasesEffects {
    constructor(private readonly actions$: Actions,
                private readonly service: UnassignedCasesService,
                private readonly loggerService: LoggerService) { }

    @Effect()
    public loadUnassignedCases$ = this.actions$.pipe(
    ofType(LOAD_UNASSINGED_CASES),
    switchMap((payload: any) => {
        return this.service.fetchUnassignedCases().pipe(
          map(unassingedCases => new LoadUnassignedCasesSuccess(unassingedCases)),
          catchError(errorResponse => {
            this.loggerService.error(errorResponse);
            return of(new LoadUnassignedCasesFailure(errorResponse.error));
          })
        );
      })
    );
}
