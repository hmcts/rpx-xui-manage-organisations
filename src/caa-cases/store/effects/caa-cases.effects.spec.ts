import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { NavItemModel } from '../../../app/models/nav-items.model';
import { LoggerService } from '../../../shared/services/logger.service';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import { CaaCases } from '../../models/caa-cases.model';
import { CaaCasesService } from '../../services';
import * as caaCasesActions from '../actions/caa-cases.actions';
import { CaaCasesEffects } from './caa-cases.effects';

describe('CaaCasesEffects', () => {
  let actions$;
  let effects: CaaCasesEffects;
  const caaCasesServiceMock = jasmine.createSpyObj('CaaCasesService', ['getCaaCases', 'getCaaCaseTypes']);
  const loggerServiceMock = jasmine.createSpyObj('LoggerService', ['error']);
  const assignedCases = {} as CaaCases;
  const unassignedCases = {} as CaaCases;
  const navItems = [] as NavItemModel[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CaaCasesService, useValue: caaCasesServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
        CaaCasesEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.inject(CaaCasesEffects);
    initTestScheduler();
    addMatchers();
  });

  describe('loadAssignedCases$', () => {
    it('loadAssignedCases successful', () => {
      caaCasesServiceMock.getCaaCases.and.returnValue(of(assignedCases));
      const caseType = '';
      const pageNo = 1;
      const pageSize = 10;
      const caaCasesFilterType = null;
      const caaCasesFilterValue = null;
      const payload = { caseType, pageNo, pageSize, caaCasesFilterType, caaCasesFilterValue };
      const action = new caaCasesActions.LoadAssignedCases(payload);
      const completion = new caaCasesActions.LoadAssignedCasesSuccess(assignedCases);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadAssignedCases$).toBeObservable(expected);
    });

    it('loadAssignedCases error', () => {
      const error: HttpErrorResponse = {
        error: 'Error',
        status: 400,
        message: 'Error',
        headers: null,
        statusText: null,
        name: null,
        ok: false,
        type: null,
        url: null
      };
      caaCasesServiceMock.getCaaCases.and.returnValue(throwError(error));
      const caseType = '';
      const pageNo = 1;
      const pageSize = 10;
      const caaCasesFilterType = null;
      const caaCasesFilterValue = null;
      const payload = { caseType, pageNo, pageSize, caaCasesFilterType, caaCasesFilterValue };
      const action = new caaCasesActions.LoadAssignedCases(payload);
      const completion = new caaCasesActions.LoadAssignedCasesFailure(error);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadAssignedCases$).toBeObservable(expected);
    });
  });

  describe('loadUnassignedCases$', () => {
    it('loadUnassignedCases successful', () => {
      caaCasesServiceMock.getCaaCases.and.returnValue(of(unassignedCases));
      const caseType = '';
      const pageNo = 1;
      const pageSize = 10;
      const caaCasesFilterType = null;
      const caaCasesFilterValue = null;
      const payload = { caseType, pageNo, pageSize, caaCasesFilterType, caaCasesFilterValue };
      const action = new caaCasesActions.LoadUnassignedCases(payload);
      const completion = new caaCasesActions.LoadUnassignedCasesSuccess(unassignedCases);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadUnassignedCases$).toBeObservable(expected);
    });

    it('loadUnassignedCases error', () => {
      const error: HttpErrorResponse = {
        error: 'Error',
        status: 400,
        message: 'Error',
        headers: null,
        statusText: null,
        name: null,
        ok: false,
        type: null,
        url: null
      };
      caaCasesServiceMock.getCaaCases.and.returnValue(throwError(error));
      const caseType = '';
      const pageNo = 1;
      const pageSize = 10;
      const caaCasesFilterType = null;
      const caaCasesFilterValue = null;
      const payload = { caseType, pageNo, pageSize, caaCasesFilterType, caaCasesFilterValue };
      const action = new caaCasesActions.LoadUnassignedCases(payload);
      const completion = new caaCasesActions.LoadUnassignedCasesFailure(error);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadUnassignedCases$).toBeObservable(expected);
    });
  });

  describe('loadCaseTypes$', () => {
    it('loadCaseTypes successful', () => {
      caaCasesServiceMock.getCaaCaseTypes.and.returnValue(of(navItems));
      const caaCasesFilterType = null;
      const caaCasesFilterValue = null;
      const payload = { caaCasesPageType: CaaCasesPageType.AssignedCases, caaCasesFilterType, caaCasesFilterValue };
      const action = new caaCasesActions.LoadCaseTypes(payload);
      const completion = new caaCasesActions.LoadCaseTypesSuccess(navItems);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadCaseTypes$).toBeObservable(expected);
    });

    it('loadCaseTypes error', () => {
      const error: HttpErrorResponse = {
        error: 'Error',
        status: 400,
        message: 'Error',
        headers: null,
        statusText: null,
        name: null,
        ok: false,
        type: null,
        url: null
      };
      caaCasesServiceMock.getCaaCaseTypes.and.returnValue(throwError(error));
      const caaCasesFilterType = null;
      const caaCasesFilterValue = null;
      const payload = { caaCasesPageType: CaaCasesPageType.AssignedCases, caaCasesFilterType, caaCasesFilterValue };
      const action = new caaCasesActions.LoadCaseTypes(payload);
      const completion = new caaCasesActions.LoadCaseTypesFailure(error);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadCaseTypes$).toBeObservable(expected);
    });
  });
});
