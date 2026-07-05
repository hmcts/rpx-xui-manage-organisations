import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { buildMockStoreProviders } from '../../../register-org/testing/mock-store-state';
import { of } from 'rxjs';
import { CaaCasesState } from '../../store/reducers';
import { CaseShareComponent } from './case-share.component';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import * as fromCasesFeature from '../../store';

describe('CaseShareComponent', () => {
  let component: CaseShareComponent;
  let fixture: ComponentFixture<CaseShareComponent>;

  let mockStore: Store<CaaCasesState>;
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
        ...buildMockStoreProviders(),
        {
          provide: FeatureToggleService,
          useValue: mockFeatureToggleService
        }
      ]
    }).compileComponents();
    mockStore = TestBed.inject(Store);
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

  it('should dispatch unassigned case share actions', () => {
    component.pageType = CaaCasesPageType.UnassignedCases;

    component.deselect(sharedCases);
    component.synchronizeStore(sharedCases);

    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(fromCasesFeature.DeleteAShareUnassignedCase));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(fromCasesFeature.SynchronizeStateToStoreUnassignedCases));
  });

  it('should dispatch assigned case share actions', () => {
    component.pageType = CaaCasesPageType.AssignedCases;

    component.deselect(sharedCases);
    component.synchronizeStore(sharedCases);

    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(fromCasesFeature.DeleteAShareAssignedCase));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(fromCasesFeature.SynchronizeStateToStoreAssignedCases));
  });

  afterEach(() => {
    fixture.destroy();
  });
});
