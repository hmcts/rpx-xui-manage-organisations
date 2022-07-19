import { CaaCases } from '../../models/caa-cases.model';
import * as fromActions from '../actions/caa-cases.actions';
import * as fromCaaCasesReducer from './caa-cases.reducer';

describe('Caa Cases', () => {
  it('undefined action should return the default state', () => {
    const initialState = fromCaaCasesReducer.initialState;
    const action = {} as any;
    const state = fromCaaCasesReducer.caaCasesReducer(undefined, action);
    expect(state).toBe(initialState);
  });

  xit('should loadUnassignedCasesSuccess action set the state', () => {
    const initialState = fromCaaCasesReducer.initialState;
    const assignedCases: CaaCases = {
      idField: 'id1',
      columnConfigs: null,
      data: null
    }

    const action = new fromActions.LoadUnassignedCasesSuccess(assignedCases);
    const state = fromCaaCasesReducer.caaCasesReducer(initialState, action);
    console.log('some1', state.assignedCases);
    expect(state.assignedCases).toBe(assignedCases);
  });
});
