import { SubNavigation } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import { CaaCases, SelectedCases } from '../../models/caa-cases.model';
import {
  LOAD_UNASSIGNED_CASE_TYPES_SUCCESS,
  LOAD_UNASSIGNED_CASES_SUCCESS,
  UPDATE_SELECTION_FOR_CASE_TYPE,
  LOAD_UNASSIGNED_CASES_FAILURE,
  CaaCasesActions,
  LOAD_ASSIGNED_CASES_SUCCESS,
  LOAD_ASSIGNED_CASE_TYPES_SUCCESS
} from '../actions/caa-cases.actions';

export interface CaaCasesState {
  assignedCases: CaaCases;
  unassignedCases: CaaCases;
  assignedCaseTypes: SubNavigation[];
  unassignedCaseTypes: SubNavigation[];
  selectedCases: SelectedCases;
}

export const initialState: CaaCasesState = {
  assignedCases: null,
  unassignedCases: null,
  assignedCaseTypes: [],
  unassignedCaseTypes: [],
  selectedCases: {}
};

export function caaCasesReducer(state = initialState, action: CaaCasesActions): CaaCasesState {
  switch (action.type) {
    case LOAD_ASSIGNED_CASES_SUCCESS:
      return {...state, assignedCases: action.payload};
    case LOAD_ASSIGNED_CASE_TYPES_SUCCESS:
      return {...state, assignedCaseTypes: action.payload };
    case LOAD_UNASSIGNED_CASES_SUCCESS:
      return {...state, unassignedCases: action.payload};
    case LOAD_UNASSIGNED_CASE_TYPES_SUCCESS:
      return {...state, unassignedCaseTypes: action.payload };
    case UPDATE_SELECTION_FOR_CASE_TYPE:
      const selectedCases: SelectedCases = { ... state.selectedCases };
      selectedCases[action.payload.casetype] = action.payload.cases;
      return { ...state,  selectedCases };
    case LOAD_UNASSIGNED_CASES_FAILURE:
      return {...state, unassignedCases: {idField: '', columnConfigs: [], data: [] }}
    default:
      return state;
  }
}

export const getAssignedCases = (state: CaaCasesState) => state.assignedCases;
export const getAssignedCaseTypes = (state: CaaCasesState) => state.assignedCaseTypes;
export const getUnassignedCases = (state: CaaCasesState) => state.unassignedCases;
export const getUnassignedCaseTypes = (state: CaaCasesState) => state.unassignedCaseTypes;
