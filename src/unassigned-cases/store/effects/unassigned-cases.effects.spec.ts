import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import * as fromRoot from '../../../app/store/index';
import { LoadUnassignedCasesSuccess } from '../actions';
import { UnAssignedCases } from '../reducers';
import { UnassignedCasesEffects } from './unassigned-cases.effects';

describe('UnassignedCasesEffects', () => {
    const service = jasmine.createSpyObj('service', ['fetchUnassignedCases']);
    const loggerService = jasmine.createSpyObj('loggerService', ['error']);
    const unassignedCase = {} as UnAssignedCases;
    it('onLoadUnassignedCases successful', () => {
      service.fetchUnassignedCases.and.returnValue(of(unassignedCase));
      const unassignedCases$ = UnassignedCasesEffects.onLoadUnassignedCases({}, service, loggerService);
      unassignedCases$.subscribe(loadUnassignedCases => expect(new LoadUnassignedCasesSuccess(unassignedCase)).toEqual(loadUnassignedCases));
    });

    it('onLoadUnassignedCases error', (done) => {
      service.fetchUnassignedCases.and.callFake(() => {
        return throwError(new HttpErrorResponse({error: '404 - Not Found', status: 404}));
      });
      const unassignedCases$ = UnassignedCasesEffects.onLoadUnassignedCases({}, service, loggerService);
      unassignedCases$.subscribe(errorAction => {
        expect(new fromRoot.Go({ path: ['/service-down']})).toEqual(errorAction);
        done();
      });
    });

    xit('onLoadUnassignedCases bad request error', (done) => {
      service.fetchUnassignedCases.and.callFake(() => {
        return throwError(new HttpErrorResponse({error: '400 - Bad Request', status: 400}));
      });
      const unassignedCases$ = UnassignedCasesEffects.onLoadUnassignedCases({}, service, loggerService);
      unassignedCases$.subscribe(errorAction => {
        expect(errorAction).toEqual(400);
        done();
      });
    });
  });
