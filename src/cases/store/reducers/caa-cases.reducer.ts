import { HttpErrorResponse } from '@angular/common/http';
import { SubNavigation } from '@hmcts/rpx-xui-common-lib';
import { CaaCases, SelectedCases } from '../../models/caa-cases.model';
import * as fromCaaActions from '../actions/caa-cases.actions';

export interface CaaCasesState {
  Cases: CaaCases;
  caseTypes: SubNavigation[];
  selectedCases: SelectedCases;
  CasesLastError: HttpErrorResponse;
  casesWithSupplementary?: any[];
}

export const initialState: CaaCasesState = {
  Cases: null,
  caseTypes: [],
  selectedCases: {},
  CasesLastError: null,
  casesWithSupplementary: []
};

export function caaCasesReducer(state = initialState, action: fromCaaActions.CaaCasesActions): CaaCasesState {
  switch (action.type) {
    case fromCaaActions.LOAD_CASES_SUCCESS:
      return { ...state, Cases: action.payload, CasesLastError: null };
    case fromCaaActions.LOAD_CASES_FAILURE:
      return { ...state, Cases: { idField: '', columnConfigs: [], data: [] }, CasesLastError: action.payload };
    case fromCaaActions.LOAD_CASE_TYPES_SUCCESS:
      return { ...state, caseTypes: action.payload, casesWithSupplementary: action.suppData };
    case fromCaaActions.UPDATE_SELECTION_FOR_CASE_TYPE:
      const selectedCases: SelectedCases = { ...state.selectedCases };
      selectedCases[action.payload.casetype] = action.payload.cases;
      return { ...state, selectedCases };
    default:
      return state;
  }
}

export const getCases = (state: CaaCasesState) => state.Cases;
export const getCasesError = (state: CaaCasesState) => state.CasesLastError;
export const getCaseTypes = (state: CaaCasesState) => state.caseTypes;
