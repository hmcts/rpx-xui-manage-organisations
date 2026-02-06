import { SharedCase } from '@hmcts/rpx-xui-common-lib';
import * as fromActions from '../actions/share-case.action';
import * as fromReducer from './share-case.reducer';

describe('Share case reducer', () => {
  describe('Actions', () => {
    let initialState;

    beforeEach(() => {
      initialState = fromReducer.initialSharedCasesState;
    });

    it('should set correct object', () => {
      const payload = {
        sharedCases: []
      };
      const action = new fromActions.AddShareAssignedCases(payload);
      const state = fromReducer.shareCasesReducer(initialState, action);
      const mockState = { shareAssignedCases: [], shareUnassignedCases: [], loading: false, error: undefined, users: [] };
      expect(state).toEqual(mockState);
    });

    it('should load state when navigate to share assigned case', () => {
      const selectedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.NavigateToShareAssignedCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareAssignedCases.length).toEqual(2);
    });

    it('should load state when navigate to share unassigned case', () => {
      const selectedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.NavigateToShareUnassignedCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareUnassignedCases.length).toEqual(2);
    });

    it('should load share assigned case', () => {
      const selectedCases = [];
      const action = new fromActions.LoadShareAssignedCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareAssignedCases.length).toEqual(0);
      expect(state.loading).toBeTruthy();
    });

    it('should load share unassigned case', () => {
      const selectedCases = [];
      const action = new fromActions.LoadShareUnassignedCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareUnassignedCases.length).toEqual(0);
      expect(state.loading).toBeTruthy();
    });

    it('should load share assigned case', () => {
      const payload = {
        path: [],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }
        ]
      };
      const action = new fromActions.AddShareAssignedCaseGo(payload);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareAssignedCases.length).toEqual(2);
    });

    it('should load share unassigned case', () => {
      const payload = {
        path: [],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }
        ]
      };
      const action = new fromActions.AddShareUnassignedCaseGo(payload);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareUnassignedCases.length).toEqual(2);
    });

    it('should load share assigned case with case type', () => {
      initialState = {
        shareAssignedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }
        ]
      };
      const caseFromNode = [{ caseId: '1', caseTitle: '' }, { caseId: '2', caseTitle: '' }];
      const action = new fromActions.LoadShareAssignedCasesSuccess(caseFromNode);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareAssignedCases.length).toEqual(2);
      expect(state.shareAssignedCases[0].caseTypeId).toEqual('type1');
      expect(state.shareAssignedCases[0].caseTitle).toEqual('James123');
    });

    it('should load share unassigned case with case type', () => {
      initialState = {
        shareUnassignedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }
        ]
      };
      const caseFromNode = [{ caseId: '1', caseTitle: '' }, { caseId: '2', caseTitle: '' }];
      const action = new fromActions.LoadShareUnassignedCasesSuccess(caseFromNode);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareUnassignedCases.length).toEqual(2);
      expect(state.shareUnassignedCases[0].caseTypeId).toEqual('type1');
      expect(state.shareUnassignedCases[0].caseTitle).toEqual('James123');
    });

    it('should save selected share assigned cases into store', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const action = new fromActions.AddShareAssignedCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareAssignedCases.length).toEqual(2);
    });

    it('should save selected share unassigned cases into store', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const action = new fromActions.AddShareUnassignedCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareUnassignedCases.length).toEqual(2);
    });

    it('should save selected share cases without duplication', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const addedSelectedCases = {
        sharedCases: [{ caseId: '2', caseTitle: 'Steve321' }, { caseId: '3', caseTitle: 'Kenny456' }]
      };
      const oldAction = new fromActions.AddShareAssignedCases(selectedCases);
      const oldState = fromReducer.shareCasesReducer(initialState, oldAction);
      const newAction = new fromActions.AddShareAssignedCases(addedSelectedCases);
      const newState = fromReducer.shareCasesReducer(oldState, newAction);
      expect(newState.shareAssignedCases.length).toEqual(3);
    });

    it('should delete an assigned case from store', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const oldAction = new fromActions.AddShareAssignedCases(selectedCases);
      const oldState = fromReducer.shareCasesReducer(initialState, oldAction);
      const payload = {
        caseId: '1'
      };
      const newAction = new fromActions.DeleteAShareAssignedCase(payload);
      const newState = fromReducer.shareCasesReducer(oldState, newAction);
      expect(newState.shareAssignedCases.length).toEqual(1);
    });

    it('should delete an unassigned case from store', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const oldAction = new fromActions.AddShareUnassignedCases(selectedCases);
      const oldState = fromReducer.shareCasesReducer(initialState, oldAction);
      const payload = {
        caseId: '1'
      };
      const newAction = new fromActions.DeleteAShareUnassignedCase(payload);
      const newState = fromReducer.shareCasesReducer(oldState, newAction);
      expect(newState.shareUnassignedCases.length).toEqual(1);
    });

    it('should get state properties for assigned cases', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const action = new fromActions.AddShareAssignedCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareAssignedCases(state).length).toEqual(2);
    });

    it('should get state properties for unassigned cases', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const action = new fromActions.AddShareUnassignedCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareUnassignedCases(state).length).toEqual(2);
    });

    it('should load user from org for case success', () => {
      const sharedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.LoadShareAssignedCasesSuccess(sharedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getOrganisationUsers(state)).toBeTruthy();
    });

    it('should synchronize state to store for assigned cases', () => {
      const sharedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.SynchronizeStateToStoreAssignedCases(sharedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareAssignedCases(state).length).toEqual(2);
    });

    it('should synchronize state to store for unassigned cases', () => {
      const sharedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.SynchronizeStateToStoreUnassignedCases(sharedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareUnassignedCases(state).length).toEqual(2);
    });

    it('should assign user to case success', () => {
      const sharedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.AssignUsersToAssignedCaseSuccess(sharedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareAssignedCases(state).length).toEqual(2);
    });

    it('should reset state if share case completed', () => {
      const action = new fromActions.ResetAssignedCaseSelection();
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareAssignedCases(state).length).toEqual(0);
    });

    it('should sort users', () => {
      const sharedCases = [
        {
          caseId: '9417373995765131',
          caseTitle: 'Neha Vs Sanjet',
          sharedWith: [
            {
              idamId: 'u444444',
              firstName: 'Shaun',
              lastName: 'Coldwell',
              email: 'shaun.coldwell@woodford.com'
            },
            {
              idamId: 'u333333',
              firstName: 'James',
              lastName: 'Priest',
              email: 'james.priest@woodford.com'
            }
          ]
        },
        {
          caseId: '9417373995765133',
          caseTitle: 'Sam Green Vs Williams Lee',
          sharedWith: [
            {
              idamId: 'u666666',
              firstName: 'Kate',
              lastName: 'Grant',
              email: 'kate.grant@lambbrooks.com'
            },
            {
              idamId: 'u888888',
              firstName: 'Joel',
              lastName: 'Molloy',
              email: 'joel.molloy@lambbrooks.com'
            }
          ]
        }
      ];
      const sortedCases: SharedCase[] = fromReducer.sortedUserInCases(sharedCases);
      expect(sortedCases[0].caseId).toEqual('9417373995765131');
      expect(sortedCases[0].sharedWith[0].firstName).toEqual('James');
      expect(sortedCases[0].sharedWith[1].firstName).toEqual('Shaun');
      expect(sortedCases[1].caseId).toEqual('9417373995765133');
      expect(sortedCases[1].sharedWith[0].firstName).toEqual('Joel');
      expect(sortedCases[1].sharedWith[1].firstName).toEqual('Kate');
    });

    afterEach(() => {
      initialState = {};
    });
  });
});
