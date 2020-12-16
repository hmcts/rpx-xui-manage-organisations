import { SubNavigation } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import {
    LOAD_UNASSIGNED_CASE_TYPES_SUCCESS,
    LOAD_UNASSIGNED_CASES_SUCCESS,
    UnassignedCasesActions,
    UPDATE_SELECTION_FOR_CASE_TYPE } from '../actions/unassigned-cases.actions';

export interface UnAssignedCases {
    idField: string;
    columnConfigs: UnAssignedCasesColumnConfig [];
    data: any[];
}

export interface UnAssignedCasesColumnConfig {
    header: string;
    key: string;
    type: string;
}

export interface CaseTypesResultsResponse {
    total: number;
    cases: any [];
    case_types_results?: CaseTypesResults [];
}

export interface CaseTypesResults {
    total: number;
    case_type_id: string;
}

export interface SelectedCases {
    [key: string]: string [];
}

export interface UnassignedCasesState {
    unassignedCases: UnAssignedCases;
    caseTypes: SubNavigation [];
    selectedCases: SelectedCases;
}

export const initialState: UnassignedCasesState = {
    unassignedCases: null,
    caseTypes: [],
    selectedCases: {}
};

export function reducer(
    state = initialState,
    action: UnassignedCasesActions): UnassignedCasesState {
        switch (action.type) {
            case LOAD_UNASSIGNED_CASES_SUCCESS:
                return {...state, unassignedCases: action.payload};
            case LOAD_UNASSIGNED_CASE_TYPES_SUCCESS:
                return {...state, caseTypes: action.payload };
            case UPDATE_SELECTION_FOR_CASE_TYPE:
                const selectedCases: SelectedCases = { ... state.selectedCases };
                selectedCases[action.payload.casetype] = action.payload.cases;
                return { ...state,  selectedCases };
            default:
                return state;
    }
}

export const getUnassignedCases = (state: UnassignedCasesState) => state.unassignedCases;
export const getUnassignedCaseTypes = (state: UnassignedCasesState) => state.caseTypes;
