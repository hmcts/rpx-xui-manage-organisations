import { getUnassignedCases, getUnassignedCasesState } from './unassinged-cases.selector';

describe('UnAssingedcases Selectors', () => {
    const unassingedCase = {
        caseCreatedDate: new Date(2020, 1, 1),
        caseDueDate: new Date(2020, 1, 1),
        caseRef: '1234',
        petFirstName: 'first',
        petLastName: 'last',
        respFirstName: 'first1',
        respLastName: 'last1',
        sRef: 'sref'
    };
    const state = {
        unassignedCases: {
            unassignedCases: {
                unassignedCases: [unassingedCase]
            }
        }
    };
    it('getUnassignedCasesState', () => {
        const selectedState = getUnassignedCasesState(state);
        console.log('expected is ', selectedState);
        expect(selectedState).toEqual({
            unassignedCases: [unassingedCase]
        });
    });
    it('getUnassignedCases', () => {
        const selectedState = getUnassignedCases(state);
        expect(selectedState).toEqual([unassingedCase]);
    });
});
