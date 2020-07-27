import { of, throwError } from 'rxjs';
import { LoadUnassignedCasesFailure, LoadUnassignedCasesSuccess } from '../actions';
import { UnassignedCasesEffects } from './unassigned-cases.effects';

describe('UnassignedCasesEffects', () => {
    const service = jasmine.createSpyObj('service', ['fetchUnassignedCases']);
    const loggerService = jasmine.createSpyObj('loggerService', ['error']);
    const unassignedCase = {
        caseCreatedDate: new Date(2020, 1, 1),
        caseDueDate: new Date(2020, 1, 1),
        caseRef: '1234',
        petFirstName: 'first',
        petLastName: 'last',
        respFirstName: 'first1',
        respLastName: 'last1',
        sRef: 'sref'
    };
    it('onLoadUnassignedCases successful', () => {
      service.fetchUnassignedCases.and.returnValue(of([unassignedCase]));
      const unassignedCases$ = UnassignedCasesEffects.onLoadUnassignedCases({}, service, loggerService);
      unassignedCases$.subscribe(loadUnassignedCases => expect(new LoadUnassignedCasesSuccess([unassignedCase])).toEqual(loadUnassignedCases));
    });

    it('onLoadUnassignedCases error', () => {
      service.fetchUnassignedCases.and.callFake(() => {
        return throwError(new Error('Fake error'));
      });
      const unassignedCases$ = UnassignedCasesEffects.onLoadUnassignedCases({}, service, loggerService);
      unassignedCases$.subscribe(errorAction => expect(new LoadUnassignedCasesFailure(undefined)).toEqual(errorAction));
    });
  });
