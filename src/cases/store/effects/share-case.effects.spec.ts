import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of } from 'rxjs';
import { CaseShareService } from '../../services';
import {
  AddShareCaseGo,
  AddShareCases,
  AssignUsersToCase,
  AssignUsersToCaseSuccess,
  LoadShareCases,
  LoadShareCasesSuccess,
  LoadUserFromOrgForCase,
  LoadUserFromOrgForCaseSuccess
} from '../actions';
import * as shareCases from '../reducers/share-case.reducer';
import * as fromShareCaseEffects from './share-case.effects';

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
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule,
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
        provideMockActions(() => actions$)
      ]
    });

    store = TestBed.inject(Store);

    spyOnDispatchToStore = spyOn(store, 'dispatch').and.callThrough();
    effects = TestBed.inject(fromShareCaseEffects.ShareCaseEffects);

    initTestScheduler();
    addMatchers();
  }));

  describe('addShareCases$', () => {
    it('should add share assigned case action', () => {
      const action = new AddShareCases({
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      });
      const completion = new AddShareCaseGo({
        path: ['/unassigned-cases/case-share'],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.addShareCases$).toBeObservable(expected);
    });
  });

  describe('navigateToAddShareCase$', () => {
    it('should add share assigned case go', () => {
      const payload = {
        path: ['/unassigned-cases/case-share'],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      };
      routerMock.navigate.and.returnValue(Promise.resolve(true));
      const action = new AddShareCaseGo(payload);
      actions$ = hot('-a', { a: action });
      effects.navigateToAddShareCase$.subscribe(() => {
        expect(routerMock.navigate).toHaveBeenCalled();
      });
    });
  });

  describe('loadShareCases$', () => {
    it('should load share cases', () => {
      const requestPayload = [
        { caseId: '1', caseTitle: 'James123' },
        { caseId: '2', caseTitle: 'Steve321' }];
      const returnPayload = [
        { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
        { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }];
      caseShareServiceMock.getShareCases.and.returnValue(of(returnPayload));
      const action = new LoadShareCases(requestPayload);
      const completion = new LoadShareCasesSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadShareCases$).toBeObservable(expected);
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
      const action = new AssignUsersToCase(requestPayload);
      const completion = new AssignUsersToCaseSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.assignUsersToCases$).toBeObservable(expected);
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
      const action = new AssignUsersToCase(requestPayload);
      const completion = new AssignUsersToCaseSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.assignUsersToCases$).toBeObservable(expected);
    });
  });
});
