import { SubNavigation } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import { CaaCases, SelectedCases } from '../../models/caa-cases.model';
import {
  LOAD_ASSIGNED_CASES_SUCCESS,
  LOAD_ASSIGNED_CASES_FAILURE,
  LOAD_UNASSIGNED_CASES_SUCCESS,
  LOAD_UNASSIGNED_CASES_FAILURE,
  UPDATE_SELECTION_FOR_CASE_TYPE,
  CaaCasesActions,
  LOAD_CASE_TYPES_SUCCESS
} from '../actions/caa-cases.actions';

export interface CaaCasesState {
  assignedCases: CaaCases;
  unassignedCases: CaaCases;
  caseTypes: SubNavigation[];
  selectedCases: SelectedCases;
}

export const initialState: CaaCasesState = {
  assignedCases: null,
  unassignedCases: null,
  caseTypes: [],
  selectedCases: {}
};

export function caaCasesReducer(state = initialState, action: CaaCasesActions): CaaCasesState {
  console.log('ACTION TYPE', action.type);
  switch (action.type) {
    case LOAD_ASSIGNED_CASES_SUCCESS:
      return {...state, assignedCases: action.payload};
    case LOAD_ASSIGNED_CASES_FAILURE:
      return {...state, assignedCases: {idField: '', columnConfigs: [], data: [] }}
    case LOAD_UNASSIGNED_CASES_SUCCESS:
      return {...state, unassignedCases: action.payload};
    case LOAD_UNASSIGNED_CASES_FAILURE:
      return {...state, unassignedCases: {idField: '', columnConfigs: [], data: [] }}
    case LOAD_CASE_TYPES_SUCCESS:
      return {...state, caseTypes: action.payload };
    case UPDATE_SELECTION_FOR_CASE_TYPE:
      const selectedCases: SelectedCases = { ... state.selectedCases };
      selectedCases[action.payload.casetype] = action.payload.cases;
      return { ...state,  selectedCases };
    default:
      return state;
  }
}

export const getAssignedCases = (state: CaaCasesState) => state.assignedCases;
export const getUnassignedCases = (state: CaaCasesState) => state.unassignedCases;
export const getCaseTypes = (state: CaaCasesState) => state.caseTypes;
