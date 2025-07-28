import { HttpErrorResponse } from '@angular/common/http';
import * as fromActions from '../actions/caa-cases.actions';
import * as fromCaaCasesReducer from './caa-cases.reducer';

describe('CaaCases Reducer', () => {
  const initialState: fromCaaCasesReducer.CaaCasesState = {
    Cases: {
      idField: 'id1',
      columnConfigs: null,
      data: null
    },
    caseTypes: [],
    selectedCases: {},
    CasesLastError: new HttpErrorResponse({ error: 'assigned cases error' })
  };

  it('should undefined action return default state', () => {
    const caaCasesState = fromCaaCasesReducer.initialState;
    const action = {} as any;
    const state = fromCaaCasesReducer.caaCasesReducer(undefined, action);
    expect(state).toBe(caaCasesState);
  });

  it('should loadAssignedCasesSuccess action set correct state', () => {
    const action = new fromActions.LoadCasesSuccess(initialState.Cases);
    const state = fromCaaCasesReducer.caaCasesReducer(initialState, action);
    expect(state.Cases).toBe(initialState.Cases);
  });

  it('should LoadAssignedCasesFailure action set error', () => {
    const error = new HttpErrorResponse({ error: 'assigned cases error' });
    const action = new fromActions.LoadCasesFailure(initialState.CasesLastError);
    const state = fromCaaCasesReducer.caaCasesReducer(initialState, action);
    expect(state.CasesLastError).toEqual(error);
  });

  it('should loadCaseTypesSuccess action set correct state', () => {
    const action = new fromActions.LoadCaseTypesSuccess(initialState.caseTypes, []);
    const state = fromCaaCasesReducer.caaCasesReducer(initialState, action);
    expect(state.caseTypes).toBe(initialState.caseTypes);
  });
});
