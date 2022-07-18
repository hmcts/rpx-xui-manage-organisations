import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CaaCases } from '../../models/caa-cases.model';
import * as fromRoot from '../../../app/store/index';
import { CaaCasesEffects } from './caa-cases.effects';
import { LoadAssignedCasesSuccess, LoadUnassignedCasesSuccess } from '../actions';

describe('CaaCasesEffects', () => {
  const service = jasmine.createSpyObj('service', ['getCaaCases', 'getCaaCaseTypes']);
  const loggerService = jasmine.createSpyObj('loggerService', ['error']);
  const assignedCase = {} as CaaCases;
  const unassignedCase = {} as CaaCases;

  it('loadAssignedCases successful', () => {
    service.getCaaCases.and.returnValue(of(assignedCase));
    const caseType = '';
    const pageNo = 1;
    const pageSize = 10;
    const action = {
      payload: { caseType, pageNo, pageSize }
    };
    const assignedCases$ = CaaCasesEffects.loadAssignedCases(action, service, loggerService);
    assignedCases$.subscribe(loadAssignedCases => expect(new LoadAssignedCasesSuccess(assignedCase)).toEqual(loadAssignedCases));
  });

  it('loadUnassignedCases successful', () => {
    service.getCaaCases.and.returnValue(of(unassignedCase));
    const caseType = '';
    const pageNo = 1;
    const pageSize = 10;
    const action = {
      payload: { caseType, pageNo, pageSize }
    };
    const unassignedCases$ = CaaCasesEffects.loadUnassignedCases(action, service, loggerService);
    unassignedCases$.subscribe(loadUnassignedCases => expect(new LoadUnassignedCasesSuccess(unassignedCase)).toEqual(loadUnassignedCases));
  });

  it('loadUnassignedCases error', (done) => {
    service.getCaaCases.and.callFake(() => {
      return throwError(new HttpErrorResponse({error: '404 - Not Found', status: 404}));
    });
    const caseType = '';
    const pageNo = 1;
    const pageSize = 10;
    const action = {
      payload: { caseType, pageNo, pageSize }
    };
    const unassignedCases$ = CaaCasesEffects.loadUnassignedCases(action, service, loggerService);
    unassignedCases$.subscribe(errorAction => {
      expect(new fromRoot.Go({ path: ['/service-down']})).toEqual(errorAction);
      done();
    });
  });
});
