import { UnAssignedCases } from '../reducers';
import { getAllUnassignedCases, getUnassignedCasesState } from './unassigned-cases.selector';

describe('UnassignedCases Selectors', () => {
    const unassignedCase = {} as UnAssignedCases;
    const state = {
        unassignedCases: {
            unassignedCases: {
                unassignedCases: unassignedCase
            },
            caseTypes: []
        }
    };
    it('getUnassignedCasesState', () => {
        const selectedState = getUnassignedCasesState(state);
        console.log('expected is ', selectedState);
        expect(selectedState.unassignedCases).toEqual(unassignedCase);
    });
    it('getUnassignedCases', () => {
        const selectedState = getAllUnassignedCases(state);
        expect(selectedState).toEqual(unassignedCase);
    });
});
