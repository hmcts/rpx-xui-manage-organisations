import { HttpErrorResponse } from '@angular/common/http';
import * as fromActions from '../actions/caa-cases.actions';
import * as fromCaaCasesReducer from './caa-cases.reducer';

describe('CaaCases Reducer', () => {
  const initialState: fromCaaCasesReducer.CaaCasesState = {
    assignedCases: {
      idField: 'id1',
      columnConfigs: null,
      data: null
    },
    unassignedCases: {
      idField: 'id2',
      columnConfigs: null,
      data: null
    },
    caseTypes: [],
    selectedCases: {},
    assignedCasesLastError: new HttpErrorResponse({ error: 'assigned cases error' }),
    unassignedCasesLastError: new HttpErrorResponse({ error: 'unassigned cases error' })
  };

  it('should undefined action return default state', () => {
    const caaCasesState = fromCaaCasesReducer.initialState;
    const action = {} as any;
    const state = fromCaaCasesReducer.caaCasesReducer(undefined, action);
    expect(state).toBe(caaCasesState);
  });

  it('should loadAssignedCasesSuccess action set correct state', () => {
    const action = new fromActions.LoadAssignedCasesSuccess(initialState.assignedCases);
    const state = fromCaaCasesReducer.caaCasesReducer(initialState, action);
    expect(state.assignedCases).toBe(initialState.assignedCases);
  });

  it('should LoadAssignedCasesFailure action set error', () => {
    const error = new HttpErrorResponse({ error: 'assigned cases error' });
    const action = new fromActions.LoadAssignedCasesFailure(initialState.assignedCasesLastError);
    const state = fromCaaCasesReducer.caaCasesReducer(initialState, action);
    expect(state.assignedCasesLastError).toEqual(error);
  });

  it('should loadUnassignedCasesSuccess action set correct state', () => {
    const action = new fromActions.LoadUnassignedCasesSuccess(initialState.unassignedCases);
    const state = fromCaaCasesReducer.caaCasesReducer(initialState, action);
    expect(state.unassignedCases).toBe(initialState.unassignedCases);
  });

  it('should LoadUnassignedCasesFailure action set error', () => {
    const error = new HttpErrorResponse({ error: 'unassigned cases error' });
    const action = new fromActions.LoadUnassignedCasesFailure(initialState.unassignedCasesLastError);
    const state = fromCaaCasesReducer.caaCasesReducer(initialState, action);
    expect(state.unassignedCasesLastError).toEqual(error);
  });

  it('should loadCaseTypesSuccess action set correct state', () => {
    const action = new fromActions.LoadCaseTypesSuccess(initialState.caseTypes);
    const state = fromCaaCasesReducer.caaCasesReducer(initialState, action);
    expect(state.caseTypes).toBe(initialState.caseTypes);
  });
});
