import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { getRouterState } from '../../../app/store/reducers';
import { CaaCasesState } from '../../store/reducers';
import * as fromCasesFeature from '../../store';
import { CaseShareComponent } from './case-share.component';

describe('CaseShareComponent', () => {
  let component: CaseShareComponent;
  let fixture: ComponentFixture<CaseShareComponent>;

  let mockStore: MockStore<CaaCasesState>;
  let dispatchSpy: jasmine.Spy;
  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['getValue']);

  const sharedCases = [{
    caseId: '9417373995765133',
    caseTitle: 'Sam Green Vs Williams Lee',
    sharedWith: [
      {
        idamId: 'u666666',
        firstName: 'Kate',
        lastName: 'Grant',
        email: 'kate.grant@lambbrooks.com'
      }]
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CaseShareComponent],
      providers: [
        provideMockStore(),
        {
          provide: FeatureToggleService,
          useValue: mockFeatureToggleService
        }
      ]
    }).compileComponents();
    mockStore = TestBed.inject(MockStore);
    mockFeatureToggleService.getValue.and.returnValue(of(true));
    dispatchSpy = spyOn(mockStore, 'dispatch');
    fixture = TestBed.createComponent(CaseShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should deselect case', () => {
    component.deselect(sharedCases);
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should synchronize to store', () => {
    component.synchronizeStore(sharedCases);
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should configure unassigned case share from router state', () => {
    mockStore.overrideSelector(getRouterState, {
      state: {
        url: '/cases/case-share',
        queryParams: {
          init: true,
          pageType: 'unassigned-cases'
        },
        params: {}
      },
      navigationId: 1
    } as any);

    component.ngOnInit();

    expect(component.backLink).toEqual('/cases');
    expect(component.confirmLink).toEqual('/cases/case-share-confirm/unassigned-cases');
    expect(component.fnTitle).toEqual('Action a case');
    expect(component.title).toEqual('Add recipient');
    expect(component.addUserLabel).toEqual('Enter email address');
    expect(component.showRemoveUsers).toBe(false);
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(fromCasesFeature.LoadShareCases));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(fromCasesFeature.LoadUserFromOrgForCase));
  });

  it('should configure assigned case share from router state', () => {
    mockStore.overrideSelector(getRouterState, {
      state: {
        url: '/cases/case-share',
        queryParams: {
          init: false,
          pageType: 'assigned-cases'
        },
        params: {}
      },
      navigationId: 1
    } as any);

    component.ngOnInit();

    expect(component.title).toEqual('Manage shared access to a case');
    expect(component.addUserLabel).toEqual('Add people to share access to the selected cases');
    expect(component.showRemoveUsers).toBe(true);
  });

  it('should configure links when coming from accept cases', () => {
    mockStore.overrideSelector(getRouterState, {
      state: {
        url: '/cases/case-share',
        queryParams: {
          init: false,
          pageType: 'unassigned-cases',
          caseAccept: true
        },
        params: {}
      },
      navigationId: 1
    } as any);

    component.ngOnInit();

    expect(component.backLink).toEqual('/cases/accept-cases');
    expect(component.confirmLink).toEqual('/cases/case-share-confirm/new-cases');
  });

  it('should dispatch typed deselect and synchronize actions', () => {
    component.deselect(sharedCases);
    component.synchronizeStore(sharedCases);

    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(fromCasesFeature.DeleteAShareCase));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(fromCasesFeature.SynchronizeStateToStoreCases));
  });

  it('should complete subscriptions on destroy', () => {
    spyOn((component as any).destroy$, 'next');
    spyOn((component as any).destroy$, 'complete');

    component.ngOnDestroy();

    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
