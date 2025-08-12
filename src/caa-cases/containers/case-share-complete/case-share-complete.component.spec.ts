import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import { CaaCasesState } from '../../store/reducers';
import { CaseShareCompleteComponent } from './case-share-complete.component';

describe('CaaCaseShareCompleteComponent', () => {
  let component: CaseShareCompleteComponent;
  let fixture: ComponentFixture<CaseShareCompleteComponent>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<CaaCasesState>;
  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['getValue']);
  let router: Router;
  const mockRoute = {
    snapshot: {
      params: {
        pageType: CaaCasesPageType.AssignedCases
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CaseShareCompleteComponent],
      imports: [RouterTestingModule],
      providers: [
        provideMockStore(),
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    }).compileComponents();
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CaseShareCompleteComponent);
    component = fixture.componentInstance;
    mockFeatureToggleService.getValue.and.returnValue(of(true));
    component.shareCases$ = of([{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      pendingShares: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }]
    }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if pending', () => {
    const sharedCases = [{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }],
      pendingUnshares: [
        {
          idamId: 'u777777',
          firstName: 'Nick',
          lastName: 'Rodrigues',
          email: 'nick.rodrigues@lambbrooks.com'
        }]
    }];
    component.isLoading = true;
    const returnValue = component.checkIfIncomplete(sharedCases);
    expect(returnValue).toEqual('PENDING');
  });

  it('should check if complete', () => {
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
    component.isLoading = true;
    const returnValue = component.checkIfIncomplete(sharedCases);
    expect(returnValue).toEqual('COMPLETE');
  });

  it('should user access block', () => {
    const case1 = {
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }]
    };
    const case2 = {
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      pendingShares: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }]
    };
    const case3 = {
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      pendingUnshares: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }]
    };
    expect(component.showUserAccessBlock(case1)).toBeFalsy();
    expect(component.showUserAccessBlock(case2)).toBeTruthy();
    expect(component.showUserAccessBlock(case3)).toBeTruthy();
  });

  xit('should tidy up shared case if complete', () => {
    component.completeScreenMode = 'COMPLETE';
    component.ngOnDestroy();
    expect(component.shareCases.length).toEqual(0);
  });

  it('should see add user info only from case if remove user feature is toggled off', () => {
    component.completeScreenMode = 'PENDING';
    component.removeUserFromCaseToggleOn$ = of(false);
    fixture.detectChanges();
    const removeUserError = fixture.debugElement.nativeElement.querySelector('#add-user-error');
    expect(removeUserError).toBeTruthy();
    const addAndRemoveUserError = fixture.debugElement.nativeElement.querySelector('#add-and-remove-user-error');
    expect(addAndRemoveUserError).toBeFalsy();
    const removeUserInfo = fixture.debugElement.nativeElement.querySelector('#add-user-info');
    expect(removeUserInfo).toBeTruthy();
    const addAndRemoveUserInfo = fixture.debugElement.nativeElement.querySelector('#add-and-remove-user-info');
    expect(addAndRemoveUserInfo).toBeFalsy();
  });

  it('should see add and remove user info from case if remove user feature is toggled on', () => {
    component.completeScreenMode = 'PENDING';
    component.removeUserFromCaseToggleOn$ = of(true);
    fixture.detectChanges();
    const removeUserError = fixture.debugElement.nativeElement.querySelector('#add-user-error');
    expect(removeUserError).toBeFalsy();
    const addAndRemoveUserError = fixture.debugElement.nativeElement.querySelector('#add-and-remove-user-error');
    expect(addAndRemoveUserError).toBeTruthy();
    const removeUserInfo = fixture.debugElement.nativeElement.querySelector('#add-user-info');
    expect(removeUserInfo).toBeFalsy();
    const addAndRemoveUserInfo = fixture.debugElement.nativeElement.querySelector('#add-and-remove-user-info');
    expect(addAndRemoveUserInfo).toBeTruthy();
  });

  it('should display the correct success text for Assigned Cases', () => {
    spyOn(store, 'pipe').and.returnValue(of({}));
    spyOnProperty(router, 'url', 'get').and.returnValue('/assigned-cases/case-share-complete');
    component.ngOnInit();
    component.completeScreenMode = 'COMPLETE';
    fixture.detectChanges();
    expect(component.isFromAssignedCasesRoute).toBe(true);
    const successTextAssignedCases1 = fixture.debugElement.nativeElement.querySelector('#what-happens-next-added');
    expect(successTextAssignedCases1).toBeTruthy();
    expect(successTextAssignedCases1.textContent).toContain('The people you added');
    const successTextAssignedCases2 = fixture.debugElement.nativeElement.querySelector('#what-happens-next-removed');
    expect(successTextAssignedCases2).toBeTruthy();
    expect(successTextAssignedCases2.textContent).toContain('If you removed someone');
    const successTextUnassignedCases = fixture.debugElement.nativeElement.querySelector('#what-happens-next-shared');
    expect(successTextUnassignedCases).toBeNull();
  });

  it('should display the correct success text for Unassigned Cases', () => {
    spyOn(store, 'pipe').and.returnValue(of({}));
    spyOnProperty(router, 'url', 'get').and.returnValue('/unassigned-cases/case-share-complete');
    component.ngOnInit();
    component.completeScreenMode = 'COMPLETE';
    fixture.detectChanges();
    expect(component.isFromAssignedCasesRoute).toBe(false);
    const successTextAssignedCases1 = fixture.debugElement.nativeElement.querySelector('#what-happens-next-added');
    expect(successTextAssignedCases1).toBeNull();
    const successTextAssignedCases2 = fixture.debugElement.nativeElement.querySelector('#what-happens-next-removed');
    expect(successTextAssignedCases2).toBeNull();
    const successTextUnassignedCases = fixture.debugElement.nativeElement.querySelector('#what-happens-next-shared');
    expect(successTextUnassignedCases).toBeTruthy();
    expect(successTextUnassignedCases.textContent).toContain('If you\'ve shared');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
