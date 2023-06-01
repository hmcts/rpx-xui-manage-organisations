import { HttpErrorResponse } from '@angular/common/http';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import { CaaCases } from '../../models/caa-cases.model';
import * as fromActions from './caa-cases.actions';

describe('Caa actions', () => {
  it('load assigned cases action', () => {
    const caseType = 'caseTypeId1';
    const pageNo = 1;
    const pageSize = 10;
    const caaCasesFilterType = null;
    const caaCasesFilterValue = null;
    const payload = { caseType, pageNo, pageSize, caaCasesFilterType, caaCasesFilterValue };
    const action = new fromActions.LoadAssignedCases(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_ASSIGNED_CASES
    });
  });

  it('load assigned cases success action', () => {
    const payload = {} as CaaCases;
    const action = new fromActions.LoadAssignedCasesSuccess(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_ASSIGNED_CASES_SUCCESS
    });
  });

  it('load assigned cases failure action', () => {
    const payload = new HttpErrorResponse({ error: 'assigned cases error' });
    const action = new fromActions.LoadAssignedCasesFailure(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_ASSIGNED_CASES_FAILURE
    });
  });

  it('load unassigned cases action', () => {
    const caseType = 'caseTypeId1';
    const pageNo = 1;
    const pageSize = 10;
    const caaCasesFilterType = null;
    const caaCasesFilterValue = null;
    const payload = { caseType, pageNo, pageSize, caaCasesFilterType, caaCasesFilterValue };
    const action = new fromActions.LoadUnassignedCases(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_UNASSIGNED_CASES
    });
  });

  it('load unassigned cases success action', () => {
    const payload = {} as CaaCases;
    const action = new fromActions.LoadUnassignedCasesSuccess(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_UNASSIGNED_CASES_SUCCESS
    });
  });

  it('load unassigned cases failure action', () => {
    const payload = new HttpErrorResponse({ error: 'unassigned cases error' });
    const action = new fromActions.LoadUnassignedCasesFailure(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_UNASSIGNED_CASES_FAILURE
    });
  });

  it('load case types action', () => {
    const caaCasesFilterType = null;
    const caaCasesFilterValue = null;
    const payload = { caaCasesPageType: CaaCasesPageType.AssignedCases, caaCasesFilterType, caaCasesFilterValue };
    const action = new fromActions.LoadCaseTypes(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_CASE_TYPES
    });
  });

  it('load case types success action', () => {
    const payload = [];
    const action = new fromActions.LoadCaseTypesSuccess(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_CASE_TYPES_SUCCESS
    });
  });

  it('load case types failure action', () => {
    const payload = {};
    const action = new fromActions.LoadCaseTypesFailure(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_CASE_TYPES_FAILURE
    });
  });
});
