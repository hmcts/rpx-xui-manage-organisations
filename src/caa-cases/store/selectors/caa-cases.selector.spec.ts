import { CaaCases } from '../../models/caa-cases.model';
import { getAllAssignedCases, getCaaCasesState } from './caa-cases.selector';

describe('UnassignedCases Selectors', () => {
  const unassignedCase = {} as CaaCases;
  const state = {
    unassignedCases: {
      unassignedCases: {
        unassignedCases: unassignedCase
      },
      caseTypes: []
    }
  };

  xit('getCaaCasesState', () => {
    const selectedState = getCaaCasesState(state);
    console.log('expected is ', selectedState);
    expect(selectedState.unassignedCases).toEqual(unassignedCase);
  });

  xit('getAllAssignedCases', () => {
    const selectedState = getAllAssignedCases(state);
    expect(selectedState).toEqual(unassignedCase);
  });
});
