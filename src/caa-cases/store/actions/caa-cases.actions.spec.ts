import { CaaCases } from 'api/caaCases/interfaces';
import * as fromActions from './caa-cases.actions';

describe('Caa actions', () => {
  it('Load Assigned Actions', () => {
    const caseType = 'caseTypeId1';
    const pageNo = 1;
    const pageSize = 10;
    const payload = { caseType, pageNo, pageSize }
    const action = new fromActions.LoadAssignedCases(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_ASSIGNED_CASES
    });
  });

  it('Load Assigned Actions Success', () => {
    const payload = {} as CaaCases;
    const action = new fromActions.LoadAssignedCasesSuccess(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_ASSIGNED_CASES_SUCCESS
    });
  });

  it('Load Assigned Actions Failure', () => {
    const payload = {};
    const action = new fromActions.LoadAssignedCasesFailure(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_ASSIGNED_CASES_FAILURE
    });
  });

  it('Load Unassigned Actions', () => {
    const caseType = 'caseTypeId1';
    const pageNo = 1;
    const pageSize = 10;
    const payload = { caseType, pageNo, pageSize }
    const action = new fromActions.LoadUnassignedCases(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_UNASSIGNED_CASES
    });
  });

  it('Load Unassigned Actions Success', () => {
    const payload = {} as CaaCases;
    const action = new fromActions.LoadUnassignedCasesSuccess(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_UNASSIGNED_CASES_SUCCESS
    });
  });

  it('Load Unassigned Actions Failure', () => {
    const payload = {};
    const action = new fromActions.LoadUnassignedCasesFailure(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_UNASSIGNED_CASES_FAILURE
    });
  });
});
