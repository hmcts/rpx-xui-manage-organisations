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
      const action = new fromActions.AddShareCases(payload);
      const state = fromReducer.shareCasesReducer(initialState, action);
      const mockState = { shareCases: [], loading: false, error: undefined, users: [] };
      expect(state).toEqual(mockState);
    });

    it('should load state when navigate to share assigned case', () => {
      const selectedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.NavigateToShareCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(2);
    });

    it('should load state when navigate to share unassigned case', () => {
      const selectedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.NavigateToShareCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(2);
    });

    it('should load share assigned case', () => {
      const selectedCases = [];
      const action = new fromActions.LoadShareCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(0);
      expect(state.loading).toBeTruthy();
    });

    it('should load share unassigned case', () => {
      const selectedCases = [];
      const action = new fromActions.LoadShareCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(0);
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
      const action = new fromActions.AddShareCaseGo(payload);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(2);
    });

    it('should load share unassigned case', () => {
      const payload = {
        path: [],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }
        ]
      };
      const action = new fromActions.AddShareCaseGo(payload);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(2);
    });

    it('should load share assigned case with case type', () => {
      initialState = {
        shareCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }
        ]
      };
      const caseFromNode = [{ caseId: '1', caseTitle: '' }, { caseId: '2', caseTitle: '' }];
      const action = new fromActions.LoadShareCasesSuccess(caseFromNode);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(2);
      expect(state.shareCases[0].caseTypeId).toEqual('type1');
      expect(state.shareCases[0].caseTitle).toEqual('James123');
    });

    it('should load share unassigned case with case type', () => {
      initialState = {
        shareCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }
        ]
      };
      const caseFromNode = [{ caseId: '1', caseTitle: '' }, { caseId: '2', caseTitle: '' }];
      const action = new fromActions.LoadShareCasesSuccess(caseFromNode);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(2);
      expect(state.shareCases[0].caseTypeId).toEqual('type1');
      expect(state.shareCases[0].caseTitle).toEqual('James123');
    });

    it('should save selected share assigned cases into store', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const action = new fromActions.AddShareCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(2);
    });

    it('should save selected share unassigned cases into store', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const action = new fromActions.AddShareCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(state.shareCases.length).toEqual(2);
    });

    it('should save selected share cases without duplication', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const addedSelectedCases = {
        sharedCases: [{ caseId: '2', caseTitle: 'Steve321' }, { caseId: '3', caseTitle: 'Kenny456' }]
      };
      const oldAction = new fromActions.AddShareCases(selectedCases);
      const oldState = fromReducer.shareCasesReducer(initialState, oldAction);
      const newAction = new fromActions.AddShareCases(addedSelectedCases);
      const newState = fromReducer.shareCasesReducer(oldState, newAction);
      expect(newState.shareCases.length).toEqual(3);
    });

    it('should delete an assigned case from store', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const oldAction = new fromActions.AddShareCases(selectedCases);
      const oldState = fromReducer.shareCasesReducer(initialState, oldAction);
      const payload = {
        caseId: '1'
      };
      const newAction = new fromActions.DeleteAShareCase(payload);
      const newState = fromReducer.shareCasesReducer(oldState, newAction);
      expect(newState.shareCases.length).toEqual(1);
    });

    it('should delete an unassigned case from store', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const oldAction = new fromActions.AddShareCases(selectedCases);
      const oldState = fromReducer.shareCasesReducer(initialState, oldAction);
      const payload = {
        caseId: '1'
      };
      const newAction = new fromActions.DeleteAShareCase(payload);
      const newState = fromReducer.shareCasesReducer(oldState, newAction);
      expect(newState.shareCases.length).toEqual(1);
    });

    it('should get state properties for assigned cases', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const action = new fromActions.AddShareCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareCases(state).length).toEqual(2);
    });

    it('should get state properties for unassigned cases', () => {
      const selectedCases = {
        sharedCases: [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }]
      };
      const action = new fromActions.AddShareCases(selectedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareCases(state).length).toEqual(2);
    });

    it('should load user from org for case success', () => {
      const sharedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.LoadShareCasesSuccess(sharedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getOrganisationUsers(state)).toBeTruthy();
    });

    it('should synchronize state to store for assigned cases', () => {
      const sharedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.SynchronizeStateToStoreCases(sharedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareCases(state).length).toEqual(2);
    });

    it('should synchronize state to store for unassigned cases', () => {
      const sharedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.SynchronizeStateToStoreCases(sharedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareCases(state).length).toEqual(2);
    });

    it('should assign user to case success', () => {
      const sharedCases = [{ caseId: '1', caseTitle: 'James123' }, { caseId: '2', caseTitle: 'Steve321' }];
      const action = new fromActions.AssignUsersToCaseSuccess(sharedCases);
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareCases(state).length).toEqual(2);
    });

    it('should reset state if share case completed', () => {
      const action = new fromActions.ResetCaseSelection();
      const state = fromReducer.shareCasesReducer(initialState, action);
      expect(fromReducer.getShareCases(state).length).toEqual(0);
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
