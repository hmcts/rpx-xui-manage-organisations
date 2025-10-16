import { SharedCase, UserDetails } from '@hmcts/rpx-xui-common-lib';
import * as ShareCasesActions from '../actions/share-case.action';

export interface ShareCasesState {
  shareAssignedCases: SharedCase[];
  shareUnassignedCases: SharedCase[];
  loading: boolean;
  error: Error;
  users: UserDetails[];
}

export const initialSharedCasesState: ShareCasesState = {
  shareAssignedCases: [],
  shareUnassignedCases: [],
  loading: false,
  error: undefined,
  users: []
};

export function shareCasesReducer(
  state: ShareCasesState = initialSharedCasesState,
  action: ShareCasesActions.Actions): ShareCasesState {
  switch (action.type) {
    case ShareCasesActions.NAVIGATE_TO_SHARE_ASSIGNED_CASES:
      const navigateToShareAssignedCases = state.shareAssignedCases.slice();
      for (const aCase of action.payload) {
        if (!navigateToShareAssignedCases.some((hasACase) => hasACase.caseId === aCase.caseId)) {
          navigateToShareAssignedCases.push(aCase);
        }
      }
      return {
        ...state,
        shareAssignedCases: navigateToShareAssignedCases
      };
    case ShareCasesActions.LOAD_SHARE_ASSIGNED_CASES:
      return {
        ...state,
        loading: true
      };
    case ShareCasesActions.LOAD_SHARE_ASSIGNED_CASES_SUCCESS:
      const casesInStore = state.shareAssignedCases.slice();
      const casesFromNode: SharedCase[] = sortedUserInCases(action.payload);
      const casesWithTypes = [];
      for (const aCase of casesInStore) {
        const intersectionCase = casesFromNode.find((nodeCase) => nodeCase.caseId === aCase.caseId);
        if (intersectionCase && intersectionCase.caseId) {
          const caseTypeId = aCase.caseTypeId ? aCase.caseTypeId : null;
          const caseTitle = aCase.caseTitle ? aCase.caseTitle : null;
          const newCase: SharedCase = {
            ...intersectionCase,
            caseTypeId,
            caseTitle
          };
          casesWithTypes.push(newCase);
        } else {
          casesWithTypes.push(aCase);
        }
      }
      return {
        ...state,
        shareAssignedCases: casesWithTypes,
        loading: false
      };
    case ShareCasesActions.LOAD_SHARE_ASSIGNED_CASES_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case ShareCasesActions.ADD_SHARE_ASSIGNED_CASES:
      const addShareAssignedCases = state.shareAssignedCases.slice();
      for (const aCase of action.payload.sharedCases) {
        if (!addShareAssignedCases.some((hasACase) => hasACase.caseId === aCase.caseId)) {
          addShareAssignedCases.push(aCase);
        }
      }
      return {
        ...state,
        shareAssignedCases: addShareAssignedCases
      };
    case ShareCasesActions.ADD_SHARE_ASSIGNED_CASES_GO:
      const addShareAssignedCasesGo = state.shareAssignedCases.slice();
      for (const aCase of action.payload.sharedCases) {
        if (!addShareAssignedCasesGo.some((hasACase) => hasACase.caseId === aCase.caseId)) {
          addShareAssignedCasesGo.push(aCase);
        }
      }
      return {
        ...state,
        shareAssignedCases: addShareAssignedCasesGo
      };
    case ShareCasesActions.DELETE_A_SHARE_ASSIGNED_CASE:
      const caseInStore4Delete = state.shareAssignedCases.slice();
      for (let i = 0, l = caseInStore4Delete.length; i < l; i++) {
        if (caseInStore4Delete[i].caseId === action.payload.caseId) {
          caseInStore4Delete.splice(i, 1);
          break;
        }
      }
      return {
        ...state,
        shareAssignedCases: caseInStore4Delete
      };
    case ShareCasesActions.SYNCHRONIZE_STATE_TO_STORE_ASSIGNED_CASES:
      return {
        ...state,
        shareAssignedCases: action.payload
      };
    case ShareCasesActions.ASSIGN_USERS_TO_ASSIGNED_CASE_SUCCESS:
      return {
        ...state,
        shareAssignedCases: action.payload,
        loading: true
      };
    case ShareCasesActions.RESET_ASSIGNED_CASE_SELECTION:
      return {
        ...state,
        shareAssignedCases: [],
        loading: false
      };
    case ShareCasesActions.NAVIGATE_TO_SHARE_UNASSIGNED_CASES:
      const navigateToShareUnassignedCases = state.shareUnassignedCases.slice();
      for (const aCase of action.payload) {
        if (!navigateToShareUnassignedCases.some((hasACase) => hasACase.caseId === aCase.caseId)) {
          navigateToShareUnassignedCases.push(aCase);
        }
      }
      return {
        ...state,
        shareUnassignedCases: navigateToShareUnassignedCases
      };
    case ShareCasesActions.LOAD_SHARE_UNASSIGNED_CASES:
      return {
        ...state,
        loading: true
      };
    case ShareCasesActions.LOAD_SHARE_UNASSIGNED_CASES_SUCCESS:
      const unassignedCasesInStore = state.shareUnassignedCases.slice();
      const unassignedCasesFromNode: SharedCase[] = sortedUserInCases(action.payload);
      const unassignedCasesWithTypes = [];
      for (const aCase of unassignedCasesInStore) {
        const intersectionCase = unassignedCasesFromNode.find((nodeCase) => nodeCase.caseId === aCase.caseId);
        if (intersectionCase && intersectionCase.caseId) {
          const caseTypeId = aCase.caseTypeId ? aCase.caseTypeId : null;
          const caseTitle = aCase.caseTitle ? aCase.caseTitle : null;
          const newCase: SharedCase = {
            ...intersectionCase,
            caseTypeId,
            caseTitle
          };
          unassignedCasesWithTypes.push(newCase);
        } else {
          unassignedCasesWithTypes.push(aCase);
        }
      }
      return {
        ...state,
        shareUnassignedCases: unassignedCasesWithTypes,
        loading: false
      };
    case ShareCasesActions.LOAD_SHARE_UNASSIGNED_CASES_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case ShareCasesActions.ADD_SHARE_UNASSIGNED_CASES:
      const addShareUnassignedCases = state.shareUnassignedCases.slice();
      for (const aCase of action.payload.sharedCases) {
        if (!addShareUnassignedCases.some((hasACase) => hasACase.caseId === aCase.caseId)) {
          addShareUnassignedCases.push(aCase);
        }
      }
      return {
        ...state,
        shareUnassignedCases: addShareUnassignedCases
      };
    case ShareCasesActions.ADD_SHARE_UNASSIGNED_CASES_GO:
      const addShareUnassignedCasesGo = state.shareUnassignedCases.slice();
      for (const aCase of action.payload.sharedCases) {
        if (!addShareUnassignedCasesGo.some((hasACase) => hasACase.caseId === aCase.caseId)) {
          addShareUnassignedCasesGo.push(aCase);
        }
      }
      return {
        ...state,
        shareUnassignedCases: addShareUnassignedCasesGo
      };
    case ShareCasesActions.DELETE_A_SHARE_UNASSIGNED_CASE:
      const unassignedCaseInStore4Delete = state.shareUnassignedCases.slice();
      for (let i = 0, l = unassignedCaseInStore4Delete.length; i < l; i++) {
        if (unassignedCaseInStore4Delete[i].caseId === action.payload.caseId) {
          unassignedCaseInStore4Delete.splice(i, 1);
          break;
        }
      }
      return {
        ...state,
        shareUnassignedCases: unassignedCaseInStore4Delete
      };
    case ShareCasesActions.LOAD_USERS_FROM_ORG_FOR_CASE_SUCCESS:
      return {
        ...state,
        users: action.payload
      };
    case ShareCasesActions.SYNCHRONIZE_STATE_TO_STORE_UNASSIGNED_CASES:
      return {
        ...state,
        shareUnassignedCases: action.payload
      };
    case ShareCasesActions.ASSIGN_USERS_TO_UNASSIGNED_CASE_SUCCESS:
      return {
        ...state,
        shareUnassignedCases: action.payload,
        loading: true
      };
    case ShareCasesActions.RESET_UNASSIGNED_CASE_SELECTION:
      return {
        ...state,
        shareUnassignedCases: [],
        loading: false
      };
    default:
      return state;
  }
}

export function sortedUserInCases(pendingSortedCases: SharedCase[]): SharedCase[] {
  const cases: SharedCase[] = [];
  for (const aCase of pendingSortedCases) {
    if (aCase.sharedWith) {
      const sortedUsers: UserDetails[] = aCase.sharedWith.slice().sort((user1, user2) => {
        return user1.firstName > user2.firstName ? 1 : (user2.firstName > user1.firstName ? -1 : 0);
      });
      const caseWithSortedUser = {
        ...aCase,
        sharedWith: sortedUsers
      };
      cases.push(caseWithSortedUser);
    } else {
      cases.push(aCase);
    }
  }
  return cases;
}

export const getShareAssignedCases = (state: ShareCasesState) => state?.shareAssignedCases;
export const getShareUnassignedCases = (state: ShareCasesState) => state?.shareUnassignedCases;
export const getOrganisationUsers = (state: ShareCasesState) => state?.users;
