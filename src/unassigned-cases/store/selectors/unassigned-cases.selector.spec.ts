import { getAllUnassignedCases, getUnassignedCasesState } from './unassigned-cases.selector';

describe('UnassignedCases Selectors', () => {
    const unassignedCase = {
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
    const state = {
        unassignedCases: {
            unassignedCases: {
                unassignedCases: [unassignedCase]
            },
            caseTypes: []
        }
    };
    it('getUnassignedCasesState', () => {
        const selectedState = getUnassignedCasesState(state);
        console.log('expected is ', selectedState);
        expect(selectedState.unassignedCases).toEqual([unassignedCase]);
    });
    it('getUnassignedCases', () => {
        const selectedState = getAllUnassignedCases(state);
        expect(selectedState).toEqual([unassignedCase]);
    });
});
