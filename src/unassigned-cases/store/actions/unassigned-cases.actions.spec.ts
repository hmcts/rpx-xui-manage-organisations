import * as fromActions from './unassigned-cases.actions';

describe('Unassigned actions', () => {
    it('Load Unassigned Actions', () => {
        const action = new fromActions.LoadUnassignedCases();
        expect({ ...action }).toEqual({
            type: fromActions.LOAD_UNASSIGNED_CASES
          });
    });
});

describe('Unassigned actions', () => {
    it('Load Unassigned Actions Success', () => {
        const payload = [{}, {}];
        const action = new fromActions.LoadUnassignedCasesSuccess(payload);
        expect({ ...action }).toEqual({
            payload,
            type: fromActions.LOAD_UNASSIGNED_CASES_SUCCESS
          });
    });
});

describe('Unassigned actions', () => {
    it('Load Unassigned Actions Failure', () => {
        const payload = {};
        const action = new fromActions.LoadUnassignedCasesFailure(payload);
        expect({ ...action }).toEqual({
            payload,
            type: fromActions.LOAD_UNASSIGNED_CASES_FAILURE
          });
    });
});
