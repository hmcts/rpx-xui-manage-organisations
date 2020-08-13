import * as fromActions from '../actions/unassigned-cases.actions';
import * as fromUnassignedCases from './unassigned-cases.reducer';

describe('Unassigned Cases', () => {
    it('undefined action should return the default state', () => {
      const { initialState } = fromUnassignedCases;
      const action = {} as any;
      const state = fromUnassignedCases.reducer(undefined, action);

      expect(state).toBe(initialState);
    });

    it('LoadUnassignedCasesSuccess action should set the state', () => {
        const { initialState } = fromUnassignedCases;
        const unassignedCase: fromUnassignedCases.UnassignedCase = {
            caseCreatedDate: new Date(2020, 1, 1),
            caseDueDate: new Date(2020, 1, 1),
            caseRef: '1234',
            petFirstName: 'first',
            petLastName: 'last',
            respFirstName: 'first1',
            respLastName: 'last1',
            sRef: 'sref',
            caseType: '123'
        };
        const action = new fromActions.LoadUnassignedCasesSuccess([unassignedCase]);
        const state = fromUnassignedCases.reducer(initialState, action);
        console.log('some1', state.unassignedCases);
        expect(state.unassignedCases[0]).toBe(unassignedCase);
      });
});
