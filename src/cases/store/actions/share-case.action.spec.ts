import * as fromCaseShare from './share-case.action';

describe('Case Share Actions', () => {
  it('NavigateToShareCases', () => {
    const payload = [];
    const action = new fromCaseShare.NavigateToShareCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.NAVIGATE_TO_SHARE_CASES,
      payload
    });
  });

  it('NavigateToShareCases', () => {
    const payload = [];
    const action = new fromCaseShare.NavigateToShareCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.NAVIGATE_TO_SHARE_CASES,
      payload
    });
  });

  it('SynchronizeStateToStoreCases', () => {
    const payload = [];
    const action = new fromCaseShare.SynchronizeStateToStoreCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.SYNCHRONIZE_STATE_TO_STORE_CASES,
      payload
    });
  });

  it('SynchronizeStateToStoreCases', () => {
    const payload = [];
    const action = new fromCaseShare.SynchronizeStateToStoreCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.SYNCHRONIZE_STATE_TO_STORE_CASES,
      payload
    });
  });

  it('LoadShareCases', () => {
    const payload = [];
    const action = new fromCaseShare.LoadShareCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_CASES,
      payload
    });
  });

  it('LoadShareCasesSuccess', () => {
    const payload = [];
    const action = new fromCaseShare.LoadShareCasesSuccess(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_CASES_SUCCESS,
      payload
    });
  });

  it('LoadShareCaseFailure', () => {
    const payload: Error = new Error();
    const action = new fromCaseShare.LoadShareCaseFailure(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_CASES_FAILURE,
      payload
    });
  });

  it('LoadShareCases', () => {
    const payload = [];
    const action = new fromCaseShare.LoadShareCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_CASES,
      payload
    });
  });

  it('LoadShareCasesSuccess', () => {
    const payload = [];
    const action = new fromCaseShare.LoadShareCasesSuccess(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_CASES_SUCCESS,
      payload
    });
  });

  it('LoadShareCaseFailure', () => {
    const payload: Error = new Error();
    const action = new fromCaseShare.LoadShareCaseFailure(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_SHARE_CASES_FAILURE,
      payload
    });
  });

  it('LoadUserFromOrgForCase', () => {
    const action = new fromCaseShare.LoadUserFromOrgForCase();
    expect({ ...action }).toEqual({
      type: fromCaseShare.LOAD_USERS_FROM_ORG_FOR_CASE
    });
  });

  it('AddShareCases', () => {
    const payload = {
      sharedCases: []
    };
    const action = new fromCaseShare.AddShareCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ADD_SHARE_CASES,
      payload
    });
  });

  it('AddShareCaseGo', () => {
    const payload = {
      path: [],
      sharedCases: []
    };
    const action = new fromCaseShare.AddShareCaseGo(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ADD_SHARE_CASES_GO,
      payload
    });
  });

  it('AddShareCases', () => {
    const payload = {
      sharedCases: []
    };
    const action = new fromCaseShare.AddShareCases(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ADD_SHARE_CASES,
      payload
    });
  });

  it('AddShareCaseGo', () => {
    const payload = {
      path: [],
      sharedCases: []
    };
    const action = new fromCaseShare.AddShareCaseGo(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ADD_SHARE_CASES_GO,
      payload
    });
  });

  it('DeleteAShareCase', () => {
    const payload = {
      caseId: '1'
    };
    const action = new fromCaseShare.DeleteAShareCase(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.DELETE_A_SHARE_CASE,
      payload
    });
  });

  it('DeleteAShareCase', () => {
    const payload = {
      caseId: '1'
    };
    const action = new fromCaseShare.DeleteAShareCase(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.DELETE_A_SHARE_CASE,
      payload
    });
  });

  it('AssignUsersToAssignedCase', () => {
    const payload = [];
    const action = new fromCaseShare.AssignUsersToCase(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ASSIGN_USERS_TO_CASE,
      pageType: undefined,
      orgIdentifier: undefined,
      payload
    });
  });

  it('AssignUsersToCase', () => {
    const payload = [];
    const action = new fromCaseShare.AssignUsersToCase(payload);
    expect({ ...action }).toEqual({
      type: fromCaseShare.ASSIGN_USERS_TO_CASE,
      pageType: undefined,
      orgIdentifier: undefined,
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
