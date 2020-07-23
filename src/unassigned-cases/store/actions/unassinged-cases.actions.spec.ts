import * as fromActions from './unassigned-cases.actions';

describe('Unassinged actions', () => {
    it('Load Unassinged Actions', () => {
        const action = new fromActions.LoadUnassignedCases();
        expect({ ...action }).toEqual({
            type: fromActions.LOAD_UNASSINGED_CASES
          });
    });
});

describe('Unassinged actions', () => {
    it('Load Unassinged Actions Sucesss', () => {
        const payload = [{}, {}];
        const action = new fromActions.LoadUnassignedCasesSuccess(payload);
        expect({ ...action }).toEqual({
            payload,
            type: fromActions.LOAD_UNASSINGED_CASES_SUCCESS
          });
    });
});

describe('Unassinged actions', () => {
    it('Load Unassinged Actions Failure', () => {
        const payload = {};
        const action = new fromActions.LoadUnassignedCasesFailure(payload);
        expect({ ...action }).toEqual({
            payload,
            type: fromActions.LOAD_UNASSINGED_CASES_FAILURE
          });
    });
});
