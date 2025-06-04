import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of } from 'rxjs';
import { CaseShareService } from '../../services';
import {
  AddShareAssignedCaseGo,
  AddShareAssignedCases,
  AddShareUnassignedCaseGo,
  AddShareUnassignedCases,
  AssignUsersToAssignedCase,
  AssignUsersToAssignedCaseSuccess,
  AssignUsersToUnassignedCase,
  AssignUsersToUnassignedCaseSuccess,
  LoadShareAssignedCases,
  LoadShareAssignedCasesSuccess,
  LoadShareUnassignedCases,
  LoadShareUnassignedCasesSuccess,
  LoadUserFromOrgForCase,
  LoadUserFromOrgForCaseSuccess
} from '../actions';
import * as shareCases from '../reducers/share-case.reducer';
import * as fromShareCaseEffects from './share-case.effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Share Case Effects', () => {
  let actions$;
  let effects: fromShareCaseEffects.ShareCaseEffects;
  let store: Store<shareCases.ShareCasesState>;
  const routerMock = jasmine.createSpyObj('Router', [
    'navigate'
  ]);
  routerMock.url = '/unassigned-cases';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let spyOnDispatchToStore = jasmine.createSpy();
  const caseShareServiceMock = jasmine.createSpyObj('CaseShareService', ['getShareCases', 'getUsersFromOrg', 'assignUsersWithCases']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}),
        RouterTestingModule],
      providers: [
        {
          provide: CaseShareService,
          useValue: caseShareServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        fromShareCaseEffects.ShareCaseEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    store = TestBed.inject(Store);

    spyOnDispatchToStore = spyOn(store, 'dispatch').and.callThrough();
    effects = TestBed.inject(fromShareCaseEffects.ShareCaseEffects);

    initTestScheduler();
    addMatchers();
  }));

  xdescribe('addShareAssignedCases$', () => {
    it('should add share assigned case action', () => {
      const action = new AddShareAssignedCases({
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      });
      const completion = new AddShareAssignedCaseGo({
        path: ['/unassigned-cases/case-share'],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.addShareAssignedCases$).toBeObservable(expected);
    });
  });

  describe('addShareUnassignedCases$', () => {
    it('should add share unassigned case action', () => {
      const action = new AddShareUnassignedCases({
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      });
      const completion = new AddShareUnassignedCaseGo({
        path: ['/unassigned-cases/case-share'],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.addShareUnassignedCases$).toBeObservable(expected);
    });
  });

  describe('navigateToAddShareAssignedCase$', () => {
    it('should add share assigned case go', () => {
      const payload = {
        path: ['/unassigned-cases/case-share'],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      };
      routerMock.navigate.and.returnValue(Promise.resolve(true));
      const action = new AddShareAssignedCaseGo(payload);
      actions$ = hot('-a', { a: action });
      effects.navigateToAddShareAssignedCase$.subscribe(() => {
        expect(routerMock.navigate).toHaveBeenCalled();
      });
    });
  });

  describe('navigateToAddShareUnassignedCase$', () => {
    it('should add share unassigned case go', () => {
      const payload = {
        path: ['/unassigned-cases/case-share'],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      };
      routerMock.navigate.and.returnValue(Promise.resolve(true));
      const action = new AddShareUnassignedCaseGo(payload);
      actions$ = hot('-a', { a: action });
      effects.navigateToAddShareUnassignedCase$.subscribe(() => {
        expect(routerMock.navigate).toHaveBeenCalled();
      });
    });
  });

  describe('loadShareAssignedCases$', () => {
    it('should load share assigned cases', () => {
      const requestPayload = [
        { caseId: '1', caseTitle: 'James123' },
        { caseId: '2', caseTitle: 'Steve321' }];
      const returnPayload = [
        { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
        { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }];
      caseShareServiceMock.getShareCases.and.returnValue(of(returnPayload));
      const action = new LoadShareAssignedCases(requestPayload);
      const completion = new LoadShareAssignedCasesSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadShareAssignedCases$).toBeObservable(expected);
    });
  });

  describe('loadShareUnassignedCases$', () => {
    it('should load share unassigned cases', () => {
      const requestPayload = [
        { caseId: '1', caseTitle: 'James123' },
        { caseId: '2', caseTitle: 'Steve321' }];
      const returnPayload = [
        { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
        { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }];
      caseShareServiceMock.getShareCases.and.returnValue(of(returnPayload));
      const action = new LoadShareUnassignedCases(requestPayload);
      const completion = new LoadShareUnassignedCasesSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadShareUnassignedCases$).toBeObservable(expected);
    });
  });

  describe('loadOrgUsers$', () => {
    it('should load organisation users', () => {
      const returnPayload = [
        {
          idamId: 'U111111',
          firstName: 'James',
          lastName: 'Priest',
          email: 'james.priest@test.com'
        },
        {
          idamId: 'U222222',
          firstName: 'Shaun',
          lastName: 'Godard',
          email: 'shaun.godard@test.com'
        }];
      caseShareServiceMock.getUsersFromOrg.and.returnValue(of(returnPayload));
      const action = new LoadUserFromOrgForCase();
      const completion = new LoadUserFromOrgForCaseSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadOrgUsers$).toBeObservable(expected);
    });
  });

  describe('assignUsersToAssignedCases$', () => {
    it('should assign users with assigned cases', () => {
      const requestPayload = [
        {
          caseId: '1', caseTitle: 'James123', caseTypeId: 'type1', sharedWith: [
            {
              idamId: 'U111111',
              firstName: 'James',
              lastName: 'Priest',
              email: 'james.priest@test.com'
            }]
        },
        {
          caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2', sharedWith: [
            {
              idamId: 'U222222',
              firstName: 'Shaun',
              lastName: 'Godard',
              email: 'shaun.godard@test.com'
            }]
        }];
      const returnPayload = [
        { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
        { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }];
      caseShareServiceMock.assignUsersWithCases.and.returnValue(of(returnPayload));
      const action = new AssignUsersToAssignedCase(requestPayload);
      const completion = new AssignUsersToAssignedCaseSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.assignUsersToAssignedCases$).toBeObservable(expected);
    });
  });

  describe('assignUsersToUnassignedCases$', () => {
    it('should assign users with unassigned cases', () => {
      const requestPayload = [
        {
          caseId: '1', caseTitle: 'James123', caseTypeId: 'type1', sharedWith: [
            {
              idamId: 'U111111',
              firstName: 'James',
              lastName: 'Priest',
              email: 'james.priest@test.com'
            }]
        },
        {
          caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2', sharedWith: [
            {
              idamId: 'U222222',
              firstName: 'Shaun',
              lastName: 'Godard',
              email: 'shaun.godard@test.com'
            }]
        }];
      const returnPayload = [
        { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
        { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }];
      caseShareServiceMock.assignUsersWithCases.and.returnValue(of(returnPayload));
      const action = new AssignUsersToUnassignedCase(requestPayload);
      const completion = new AssignUsersToUnassignedCaseSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.assignUsersToUnassignedCases$).toBeObservable(expected);
    });
  });
});
