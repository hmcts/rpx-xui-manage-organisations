import * as fromCaseShare from './share-case.action';

describe('Case Share Actions', () => {
  it('NavigateToShareAssignedCases', () => {
    const payload = [];
    const action = new fromCaseShare.NavigateToShareAssignedCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.NAVIGATE_TO_SHARE_ASSIGNED_CASES,
      payload
    });
  });

  it('NavigateToShareUnassignedCases', () => {
    const payload = [];
    const action = new fromCaseShare.NavigateToShareUnassignedCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.NAVIGATE_TO_SHARE_UNASSIGNED_CASES,
      payload
    });
  });

  it('SynchronizeStateToStoreAssignedCases', () => {
    const payload = [];
    const action = new fromCaseShare.SynchronizeStateToStoreAssignedCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.SYNCHRONIZE_STATE_TO_STORE_ASSIGNED_CASES,
      payload
    });
  });

  it('SynchronizeStateToStoreUnassignedCases', () => {
    const payload = [];
    const action = new fromCaseShare.SynchronizeStateToStoreUnassignedCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.SYNCHRONIZE_STATE_TO_STORE_UNASSIGNED_CASES,
      payload
    });
  });

  it('LoadShareAssignedCases', () => {
    const payload = [];
    const action = new fromCaseShare.LoadShareAssignedCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_ASSIGNED_CASES,
      payload
    });
  });

  it('LoadShareAssignedCasesSuccess', () => {
    const payload = [];
    const action = new fromCaseShare.LoadShareAssignedCasesSuccess(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_ASSIGNED_CASES_SUCCESS,
      payload
    });
  });

  it('LoadShareAssignedCaseFailure', () => {
    const payload: Error = new Error();
    const action = new fromCaseShare.LoadShareAssignedCaseFailure(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_ASSIGNED_CASES_FAILURE,
      payload
    });
  });

  it('LoadShareUnassignedCases', () => {
    const payload = [];
    const action = new fromCaseShare.LoadShareUnassignedCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_UNASSIGNED_CASES,
      payload
    });
  });

  it('LoadShareUnassignedAssignedCasesSuccess', () => {
    const payload = [];
    const action = new fromCaseShare.LoadShareUnassignedCasesSuccess(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_UNASSIGNED_CASES_SUCCESS,
      payload
    });
  });

  it('LoadShareUnassignedCaseFailure', () => {
    const payload: Error = new Error();
    const action = new fromCaseShare.LoadShareUnassignedCaseFailure(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_UNASSIGNED_CASES_FAILURE,
      payload
    });
  });

  it('LoadUserFromOrgForCase', () => {
    const action = new fromCaseShare.LoadUserFromOrgForCase();
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_USERS_FROM_ORG_FOR_CASE
    });
  });

  it('AddShareAssignedCases', () => {
    const payload = {
      sharedCases: []
    };
    const action = new fromCaseShare.AddShareAssignedCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ADD_SHARE_ASSIGNED_CASES,
      payload
    });
  });

  it('AddShareAssignedCaseGo', () => {
    const payload = {
      path: [],
      sharedCases: []
    };
    const action = new fromCaseShare.AddShareAssignedCaseGo(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ADD_SHARE_ASSIGNED_CASES_GO,
      payload
    });
  });

  it('AddShareUnassignedCases', () => {
    const payload = {
      sharedCases: []
    };
    const action = new fromCaseShare.AddShareUnassignedCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ADD_SHARE_UNASSIGNED_CASES,
      payload
    });
  });

  it('AddShareUnassignedCaseGo', () => {
    const payload = {
      path: [],
      sharedCases: []
    };
    const action = new fromCaseShare.AddShareUnassignedCaseGo(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ADD_SHARE_UNASSIGNED_CASES_GO,
      payload
    });
  });

  it('DeleteAShareAssignedCase', () => {
    const payload = {
      caseId: '1'
    };
    const action = new fromCaseShare.DeleteAShareAssignedCase(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.DELETE_A_SHARE_ASSIGNED_CASE,
      payload
    });
  });

  it('DeleteAShareUnassignedCase', () => {
    const payload = {
      caseId: '1'
    };
    const action = new fromCaseShare.DeleteAShareUnassignedCase(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.DELETE_A_SHARE_UNASSIGNED_CASE,
      payload
    });
  });

  it('AssignUsersToAssignedCase', () => {
    const payload = [];
    const action = new fromCaseShare.AssignUsersToAssignedCase(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ASSIGN_USERS_TO_ASSIGNED_CASE,
      payload
    });
  });

  it('AssignUsersToUnassignedCase', () => {
    const payload = [];
    const action = new fromCaseShare.AssignUsersToUnassignedCase(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ASSIGN_USERS_TO_UNASSIGNED_CASE,
      payload
    });
  });

  it('LoadUserFromOrgForCaseSuccess', () => {
    const payload = [];
    const action = new fromCaseShare.LoadUserFromOrgForCaseSuccess(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_USERS_FROM_ORG_FOR_CASE_SUCCESS,
      payload
    });
  });
});
