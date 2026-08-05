import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesComponent } from './cases.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CaaCasesService } from 'src/cases/services';
import * as organisationStore from '../../../organisation/store';
import * as caaCasesStore from '../../store';
import { CaaCasesFilterType, CaaCasesPageType } from 'src/cases/models/caa-cases.enum';
import { ENVIRONMENT_CONFIG } from '../../../models/environmentConfig.model';

describe('CasesComponent', () => {
  let component: CasesComponent;
  let fixture: ComponentFixture<CasesComponent>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;
  let mockEnvironmentConfig: { ogdUpdateRefreshUserEnabled: boolean };

  const createComponent = (): void => {
    fixture = TestBed.createComponent(CasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const loadCaseTypesDispatchCount = (): number => dispatchSpy.calls.allArgs()
    .filter(([action]) => action.type === caaCasesStore.LOAD_CASE_TYPES).length;

  beforeEach(async () => {
    caaCasesService = jasmine.createSpyObj<CaaCasesService>(
      'caaCasesService',
      [
        'getCaaCases',
        'getCaaCaseTypes',
        'storeSessionState',
        'retrieveSessionState',
        'removeSessionState'
      ]
    );
    caaCasesService.retrieveSessionState.and.returnValue(null);
    mockEnvironmentConfig = { ogdUpdateRefreshUserEnabled: false };
    await TestBed.configureTestingModule({
      declarations: [CasesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [provideMockStore(),
        { provide: CaaCasesService, useValue: caaCasesService },
        { provide: ENVIRONMENT_CONFIG, useValue: mockEnvironmentConfig }
      ],
      imports: [
        MatAutocompleteModule
      ]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should reset the current page when the selected filter changes', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    component.currentPageNo = 5;
    component.selectedFilterType = CaaCasesFilterType.UnassignedCases;
    component.selectedFilterValue = null;

    component.onSelectedFilter({
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      filterValue: '1111222233334444'
    });

    expect(component.currentPageNo).toBe(1);
  });

  it('should keep the current page when the selected filter has not changed', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    component.currentPageNo = 5;
    component.selectedFilterType = CaaCasesFilterType.UnassignedCases;
    component.selectedFilterValue = null;

    component.onSelectedFilter({
      filterType: CaaCasesFilterType.UnassignedCases,
      filterValue: null
    });

    expect(component.currentPageNo).toBe(5);
  });

  it('should reset the current page when the selected tab changes', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    component.currentPageNo = 5;
    component.allCaseTypes = [{ text: 'Case type 1' } as any];

    component.onTabChanged('Case type 1');

    expect(component.currentPageNo).toBe(1);
  });

  it('should not reload case types when the selected filter is already loaded', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    dispatchSpy.calls.reset();
    component.selectedFilterType = CaaCasesFilterType.UnassignedCases;
    component.selectedFilterValue = null;
    (component as any).hasLoadedCaseTypesForCurrentFilter = true;

    component.onSelectedFilter({
      filterType: CaaCasesFilterType.UnassignedCases,
      filterValue: null
    });

    expect(loadCaseTypesDispatchCount()).toBe(0);
  });

  it('should reload case types when the selected filter changes', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    dispatchSpy.calls.reset();
    component.selectedFilterType = CaaCasesFilterType.UnassignedCases;
    component.selectedFilterValue = null;
    (component as any).hasLoadedCaseTypesForCurrentFilter = true;

    component.onSelectedFilter({
      filterType: CaaCasesFilterType.AllAssignedCases,
      filterValue: null
    });

    expect(loadCaseTypesDispatchCount()).toBe(1);
  });

  it('should hide access all cases warning text when OGD update refresh user is disabled', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    component.selectedFilterType = CaaCasesFilterType.UnassignedCases;
    (component as any).caaCasesPageType = CaaCasesPageType.UnassignedCases;

    expect(component.casesWarningText[0]).toContain('not assigned to any users');
    expect(component.casesWarningText.length).toBe(1);
  });

  it('should show access all cases warning text when OGD update refresh user is enabled', () => {
    mockEnvironmentConfig.ogdUpdateRefreshUserEnabled = true;
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    component.selectedFilterType = CaaCasesFilterType.UnassignedCases;
    (component as any).caaCasesPageType = CaaCasesPageType.UnassignedCases;

    expect(component.casesWarningText[0]).toContain('not assigned to any users');
    expect(component.casesWarningText[1]).toContain('Access all cases in the organisation');
  });

  it('should show warning text for assigned cases', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    component.selectedFilterType = CaaCasesFilterType.AllAssignedCases;
    (component as any).caaCasesPageType = CaaCasesPageType.AssignedCases;

    expect(component.casesWarningText[0]).toContain('assigned to users');
    expect(component.casesWarningText[1]).toContain('manage case sharing');
  });

  it('should show warning text for new cases', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    component.selectedFilterType = CaaCasesFilterType.NewCasesToAccept;
    (component as any).caaCasesPageType = CaaCasesPageType.NewCases;

    expect(component.casesWarningText[0]).toContain('new cases');
    expect(component.casesWarningText[1]).toContain('accept cases');
  });

  it('should load case types and case data', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    dispatchSpy.calls.reset();
    component.allCaseTypes = [{ text: 'Asylum' } as any];
    component.selectedCaseType = 'Asylum';

    component.loadCaseTypes();
    component.loadCaseData();

    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(caaCasesStore.LoadCaseTypes));
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(caaCasesStore.LoadCases));
  });

  it('should update selected case type when tabs change', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    spyOn(component, 'loadCaseData');
    spyOn(component, 'checkShareButtonText');
    component.currentPageNo = 4;

    component.onTabChanged('Civil');

    expect(component.selectedCaseType).toEqual('Civil');
    expect(component.currentPageNo).toEqual(1);
    expect(component.loadCaseData).toHaveBeenCalled();
    expect(component.checkShareButtonText).toHaveBeenCalled();
  });

  it('should get selected case type config', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    component.selectedCaseType = 'Civil';
    component.allCaseTypes = [
      { text: 'Asylum', caseConfig: { new_cases: false } },
      { text: 'Civil', caseConfig: { new_cases: true } }
    ] as any;

    expect(component.getCaseType()).toEqual({ text: 'Civil', caseConfig: { new_cases: true } } as any);
  });

  it('should update share button text for case reference results', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, {
      organisationIdentifier: 'org-id'
    } as any);
    createComponent();
    component.cases = [{ case_id: '1' }];
    component.allCaseTypes = [{ text: 'Asylum' } as any];
    component.selectedFilterType = CaaCasesFilterType.CaseReferenceNumber;
    component.orgIdentifier = 'org-id';

    component.caseDataWithSupplementary = [{
      supplementary_data: {
        new_case: { 'org-id': true },
        orgs_assigned_users: { 'org-id': 0 }
      }
    }];
    component.checkShareButtonText();
    expect(component.caseResultsTableShareButtonText).toEqual('Accept cases');
    expect((component as any).caaCasesPageType).toEqual(CaaCasesPageType.NewCases);

    component.selectedFilterType = CaaCasesFilterType.CaseReferenceNumber;
    component.caseDataWithSupplementary = [{
      supplementary_data: {
        new_case: { 'org-id': false },
        orgs_assigned_users: { 'org-id': 2 }
      }
    }];
    component.checkShareButtonText();
    expect(component.caseResultsTableShareButtonText).toEqual('Manage case sharing');
    expect((component as any).caaCasesPageType).toEqual(CaaCasesPageType.AssignedCases);

    component.selectedFilterType = CaaCasesFilterType.CaseReferenceNumber;
    component.caseDataWithSupplementary = [{
      supplementary_data: {
        new_case: { 'org-id': false },
        orgs_assigned_users: { 'org-id': 0 }
      }
    }];
    component.checkShareButtonText();
    expect(component.caseResultsTableShareButtonText).toEqual('Share Case');
    expect((component as any).caaCasesPageType).toEqual(CaaCasesPageType.UnassignedCases);
  });

  it('should update page type and button text for filter selections', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    spyOn(component, 'loadCaseTypes');

    component.onSelectedFilter({ filterType: CaaCasesFilterType.CaseReferenceNumber, filterValue: '1234567812345678' });
    expect(component.caseResultsTableShareButtonText).toEqual('Accept cases');

    component.onSelectedFilter({ filterType: CaaCasesFilterType.CasesAssignedToAUser, filterValue: 'user-id' });
    expect(component.caseResultsTableShareButtonText).toEqual('Manage cases');
    expect((component as any).caaCasesPageType).toEqual(CaaCasesPageType.AssignedCases);

    component.onSelectedFilter({ filterType: CaaCasesFilterType.NewCasesToAccept, filterValue: null });
    expect(component.caseResultsTableShareButtonText).toEqual('Accept cases');
    expect((component as any).caaCasesPageType).toEqual(CaaCasesPageType.NewCases);

    component.onSelectedFilter({ filterType: CaaCasesFilterType.UnassignedCases, filterValue: null });
    expect(component.caseResultsTableShareButtonText).toEqual('Share Case');
    expect((component as any).caaCasesPageType).toEqual(CaaCasesPageType.UnassignedCases);
  });

  it('should manage errors, filter visibility and session state', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    const errors = [{ title: '', description: 'Invalid', fieldId: 'field' }];

    component.onErrorMessages(errors);
    expect(component.errorMessages).toEqual(errors);
    expect(component.isAnyError()).toBe(true);

    component.toggleFilterSection();
    expect(component.showFilterSection).toBe(true);

    component.removeSessionState('casesPage');
    expect(caaCasesService.removeSessionState).toHaveBeenCalledWith('casesPage');

    component.storeSessionState({ filterType: CaaCasesFilterType.CasesAssignedToAUser, filterValue: 'user-id' });
    expect(caaCasesService.storeSessionState).toHaveBeenCalledWith({
      key: 'casesPage',
      value: {
        filterType: CaaCasesFilterType.CasesAssignedToAUser,
        caseReferenceNumber: null,
        assigneeName: 'user-id'
      }
    });
  });

  it('should retrieve existing session state and toggle filter section', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    caaCasesService.retrieveSessionState.and.returnValue({
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      caseReferenceNumber: '1234567812345678',
      assigneeName: null
    });
    createComponent();

    expect(component.sessionStateValue.caseReferenceNumber).toEqual('1234567812345678');
    expect(component.showFilterSection).toBe(true);
  });

  it('should synchronize selected cases and page changes', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    dispatchSpy.calls.reset();
    spyOn(component, 'loadCaseData');
    const selectedCases = [{ case_id: '1', case_title: 'Selected case' }];

    component.onCaseSelected(selectedCases);
    expect(component.selectedCases).toEqual(selectedCases);
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(caaCasesStore.SynchronizeStateToStoreCases));

    component.onPageChanged(3);
    expect(component.currentPageNo).toEqual(3);
    expect(component.loadCaseData).toHaveBeenCalled();
  });

  it('should dispatch share actions for each filter type', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    dispatchSpy.calls.reset();
    component.selectedCases = [{ case_id: '1', case_title: 'Selected case' }];
    component.selectedCaseType = 'Asylum';
    component.allCaseTypes = [{ text: 'Asylum', caseConfig: { new_cases: true, group_access: true } }] as any;

    [
      CaaCasesFilterType.CaseReferenceNumber,
      CaaCasesFilterType.CasesAssignedToAUser,
      CaaCasesFilterType.AllAssignedCases,
      CaaCasesFilterType.NewCasesToAccept,
      CaaCasesFilterType.UnassignedCases
    ].forEach((filterType) => {
      component.selectedFilterType = filterType;
      component.onShareButtonClicked('Asylum');
    });

    const addShareCasesCount = dispatchSpy.calls.allArgs()
      .filter(([action]) => action instanceof caaCasesStore.AddShareCases).length;
    expect(addShareCasesCount).toEqual(5);
  });

  it('should complete destroy subject on destroy', () => {
    store.overrideSelector(organisationStore.getOrganisationSel, null);
    createComponent();
    spyOn((component as any).destroy$, 'next');
    spyOn((component as any).destroy$, 'complete');

    component.ngOnDestroy();

    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });
});
