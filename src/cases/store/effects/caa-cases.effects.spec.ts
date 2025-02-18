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
  const cases = {} as CaaCases;
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

  describe('loadCases$', () => {
    it('loadCases successful', () => {
      caaCasesServiceMock.getCaaCases.and.returnValue(of(cases));
      const caseType = '';
      const pageNo = 1;
      const pageSize = 10;
      const caaCasesFilterType = null;
      const caaCasesFilterValue = null;
      const caaCasesPage = CaaCasesPageType.AssignedCases;
      const payload = { caseType, pageNo, pageSize, caaCasesPage, caaCasesFilterType, caaCasesFilterValue };
      const action = new caaCasesActions.LoadCases(payload);
      const completion = new caaCasesActions.LoadCasesSuccess(cases);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadCases$).toBeObservable(expected);
    });

    it('loadCases error', () => {
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
      const caaCasesPage = CaaCasesPageType.AssignedCases;
      const payload = { caseType, pageNo, pageSize, caaCasesPage, caaCasesFilterType, caaCasesFilterValue };
      const action = new caaCasesActions.LoadCases(payload);
      const completion = new caaCasesActions.LoadCasesFailure(error);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadCases$).toBeObservable(expected);
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
