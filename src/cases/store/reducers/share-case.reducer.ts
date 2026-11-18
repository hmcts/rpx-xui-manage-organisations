import { UserDetails, SharedCase } from '@hmcts/rpx-xui-common-lib';
import * as ShareCasesActions from '../actions/share-case.action';
import { addUniqueCases, mergeCasesWithTypes, removeCaseById, sortedUserInCases } from '../share-case.workflow';

export interface ShareCasesState {
  shareCases: SharedCase[];
  loading: boolean;
  error: Error;
  users: UserDetails[];
}

export const initialSharedCasesState: ShareCasesState = {
  shareCases: [],
  loading: false,
  error: undefined,
  users: []
};

export function shareCasesReducer(
  state: ShareCasesState = initialSharedCasesState,
  action: ShareCasesActions.Actions
): ShareCasesState {
  switch (action.type) {
    case ShareCasesActions.NAVIGATE_TO_SHARE_CASES:
      return {
        ...state,
        shareCases: addUniqueCases(state.shareCases, action.payload)
      };

    case ShareCasesActions.LOAD_SHARE_CASES:
      return {
        ...state,
        loading: true
      };

    case ShareCasesActions.LOAD_SHARE_CASES_SUCCESS:
      return {
        ...state,
        shareCases: mergeCasesWithTypes(
          state.shareCases,
          sortedUserInCases(action.payload)
        ),
        loading: false
      };

    case ShareCasesActions.LOAD_SHARE_CASES_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ShareCasesActions.ADD_SHARE_CASES:
    case ShareCasesActions.ADD_SHARE_CASES_GO:
      return {
        ...state,
        shareCases: addUniqueCases(
          state.shareCases,
          action.payload.sharedCases
        )
      };

    case ShareCasesActions.DELETE_A_SHARE_CASE:
      return {
        ...state,
        shareCases: removeCaseById(state.shareCases, action.payload.caseId)
      };

    case ShareCasesActions.SYNCHRONIZE_STATE_TO_STORE_CASES:
      return {
        ...state,
        shareCases: action.payload
      };

    case ShareCasesActions.ASSIGN_USERS_TO_CASE_SUCCESS:
      return {
        ...state,
        shareCases: action.payload,
        loading: true
      };

    case ShareCasesActions.RESET_CASE_SELECTION:
      return {
        ...state,
        shareCases: [],
        loading: false
      };

    case ShareCasesActions.LOAD_USERS_FROM_ORG_FOR_CASE_SUCCESS:
      return {
        ...state,
        users: action.payload
      };

    default:
      return state;
  }
}

export { sortedUserInCases } from '../share-case.workflow';

export const getShareCases = (state: ShareCasesState) => state.shareCases;
export const getOrganisationUsers = (state: ShareCasesState) => state.users;
