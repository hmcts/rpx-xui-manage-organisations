import { HttpErrorResponse } from '@angular/common/http';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import { CaaCases } from '../../models/caa-cases.model';
import * as fromActions from './caa-cases.actions';

describe('Caa actions', () => {
  it('load  cases action', () => {
    const caseType = 'caseTypeId1';
    const pageNo = 1;
    const pageSize = 10;
    const caaCasesFilterType = null;
    const caaCasesFilterValue = null;
    const caaCasesPage = 'assigned-cases';
    const payload = { caseType, pageNo, pageSize, caaCasesPage, caaCasesFilterType, caaCasesFilterValue };
    const action = new fromActions.LoadCases(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_CASES
    });
  });

  it('load  cases success action', () => {
    const payload = {} as CaaCases;
    const action = new fromActions.LoadCasesSuccess(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_CASES_SUCCESS
    });
  });

  it('load  cases failure action', () => {
    const payload = new HttpErrorResponse({ error: ' cases error' });
    const action = new fromActions.LoadCasesFailure(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_CASES_FAILURE
    });
  });

  it('load un cases action', () => {
    const caseType = 'caseTypeId1';
    const pageNo = 1;
    const pageSize = 10;
    const caaCasesFilterType = null;
    const caaCasesFilterValue = null;
    const caaCasesPage = 'assigned-cases';
    const payload = { caseType, pageNo, pageSize, caaCasesPage, caaCasesFilterType, caaCasesFilterValue };
    const action = new fromActions.LoadCases(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_CASES
    });
  });

  it('load un cases success action', () => {
    const payload = {} as CaaCases;
    const action = new fromActions.LoadCasesSuccess(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_CASES_SUCCESS
    });
  });

  it('load un cases failure action', () => {
    const payload = new HttpErrorResponse({ error: 'un cases error' });
    const action = new fromActions.LoadCasesFailure(payload);
    expect({ ...action }).toEqual({
      payload,
      type: fromActions.LOAD_CASES_FAILURE
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
