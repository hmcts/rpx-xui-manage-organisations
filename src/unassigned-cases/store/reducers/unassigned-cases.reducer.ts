import {LOAD_UNASSINGED_CASES_SUCCESS, UnassignedCasesActions} from '../actions/unassigned-cases.actions';

export interface UnassignedCase {
    caseCreatedDate: Date;
    caseDueDate: Date;
    caseRef: string;
    petFirstName: string;
    petLastName: string;
    respFirstName: string;
    respLastName: string;
    sRef: string;
}

export interface UnassignedCasesState {
    unassignedCases: UnassignedCase [];
}

export const initialState: UnassignedCasesState = {
    unassignedCases: []
};

export function reducer(
    state = initialState,
    action: UnassignedCasesActions): UnassignedCasesState {
        switch (action.type) {
            case LOAD_UNASSINGED_CASES_SUCCESS:
                return {...initialState, unassignedCases: action.payload};
            default:
                return state;
    }
}

export const getUnassignedCases = (state: UnassignedCasesState) => state.unassignedCases;
