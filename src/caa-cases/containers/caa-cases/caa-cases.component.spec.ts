import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromOrganisationStore from '../../../organisation/store';
import {
  CaaCasesFilterType,
  CaaCasesNoDataMessage,
  CaaCasesPageTitle,
  CaaCasesPageType,
  CaaCasesShowHideFilterButtonText
} from '../../models/caa-cases.enum';
import { CaaCasesSessionState, CaaCasesSessionStateValue } from '../../models/caa-cases.model';
import { CaaCasesService } from '../../services';
import * as fromStore from '../../store';
import { CaaCasesComponent } from './caa-cases.component';
import { buildMockStoreProviders } from '../../../register-org/testing/mock-store-state';
import { ROUTES as AppRoutes } from 'src/app/app.routes';

describe('CaaCasesComponent', () => {
  let component: CaaCasesComponent;
  let fixture: ComponentFixture<CaaCasesComponent>;
  let store: Store<fromStore.CaaCasesState>;
  let organisationStore: Store<fromOrganisationStore.OrganisationState>;
  let router: Router;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;
  const sessionStateValue: CaaCasesSessionStateValue = {
    filterType: CaaCasesFilterType.AssigneeName,
    caseReferenceNumber: null,
    assigneeName: 'assignee123'
  };
  const sessionState: CaaCasesSessionState = {
    key: 'assigned-cases',
    value: sessionStateValue
  };

  beforeEach(waitForAsync(() => {
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
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CaaCasesComponent],
      imports: [
        RouterTestingModule.withRoutes(AppRoutes)
      ],
      providers: [
        { provide: CaaCasesService, useValue: caaCasesService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...buildMockStoreProviders()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    organisationStore = TestBed.inject(Store);
    fixture = TestBed.createComponent(CaaCasesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('is truthy', () => {
    expect(component).toBeTruthy();
  });

  it('should set current page type', () => {
    const routerUrlPropertySpy = spyOnProperty(router, 'url', 'get').and.returnValue('/unassigned-cases');
    component.setCurrentPageType();
    expect(component.caaCasesPageType).toEqual(CaaCasesPageType.UnassignedCases);
    routerUrlPropertySpy.and.returnValue('/assigned-cases');
    component.setCurrentPageType();
    expect(component.caaCasesPageType).toEqual(CaaCasesPageType.AssignedCases);
  });

  it('should set current page title', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.setCurrentPageTitle();
    expect(component.pageTitle).toEqual(CaaCasesPageTitle.UnassignedCases);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.setCurrentPageTitle();
    expect(component.pageTitle).toEqual(CaaCasesPageTitle.AssignedCases);
  });

  it('should set show hide filter button text', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.setShowHideFilterButtonText();
    expect(component.caaShowHideFilterButtonText).toEqual(CaaCasesShowHideFilterButtonText.UnassignedCasesShow);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.setShowHideFilterButtonText();
    expect(component.caaShowHideFilterButtonText).toEqual(CaaCasesShowHideFilterButtonText.AssignedCasesShow);
  });

  it('should set selected filter type and value', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.setSelectedFilterTypeAndValue();
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.None);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.setSelectedFilterTypeAndValue();
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.AllAssignees);
    expect(component.selectedFilterValue).toBeNull();
  });

  it('should load case types', () => {
    const storeDispatchMock = spyOn(store, 'dispatch');
    const storePipeMock = spyOn(store, 'pipe');
    const storeSelectMock = spyOn(store, 'select');
    storeDispatchMock.and.returnValue(null);
    storePipeMock.and.returnValue(of({}));
    storeSelectMock.and.returnValue(of({}));
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.loadCaseTypes(CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(store.dispatch).toHaveBeenCalled();
    expect(store.pipe).toHaveBeenCalled();
  });

  it('should load cases and set table config', () => {
    spyOn(component, 'setTableConfig');
    const storePipeMock = spyOn(store, 'pipe');
    const storeSelectMock = spyOn(store, 'select');
    storePipeMock.and.returnValue(of({}));
    storeSelectMock.and.returnValue(of({}));
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.loadCasesAndSetTableConfig();
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.loadCasesAndSetTableConfig();
    expect(component.setTableConfig).toHaveBeenCalledTimes(2);
  });

  it('should load case data only when case type is set', () => {
    const storeDispatchMock = spyOn(store, 'dispatch');
    const storePipeMock = spyOn(store, 'pipe');
    storeDispatchMock.and.returnValue(null);
    storePipeMock.and.returnValue(of({}));
    component.currentCaseType = 'FinancialRemedyConsented';
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.loadDataFromStore();
    expect(store.dispatch).toHaveBeenCalled();
    expect(store.pipe).toHaveBeenCalledTimes(2);
  });

  it('should not load case data only when case type is not set', () => {
    const storeDispatchMock = spyOn(store, 'dispatch');
    const storePipeMock = spyOn(store, 'pipe');
    storeDispatchMock.and.returnValue(null);
    storePipeMock.and.returnValue(of({}));
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.loadDataFromStore();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(store.pipe).toHaveBeenCalledTimes(0);
  });

  it('should load data from store error', () => {
    spyOn(store, 'pipe').and.returnValue(of({}));
    const httpErrorResponse = new HttpErrorResponse({ error: 'unassigned cases error' });
    component.casesError$ = of(httpErrorResponse);
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.navItems = [
      { text: 'Financial Remedy Consented', href: '', active: true },
      { text: 'Asylum', href: '', active: false }
    ];
    component.loadDataFromStore();
    fixture.detectChanges();
    const casesErrorElement = fixture.debugElement.nativeElement.querySelector('#cases-error');
    expect(casesErrorElement.textContent.trim()).toEqual('This view has not been configured for the case type.');
  });

  it('should set table config', () => {
    let config = null;
    component.setTableConfig(config);
    expect(component.tableConfig).toBeUndefined();
    config = new TableConfig();
    component.setTableConfig(config);
    expect(component.tableConfig).not.toBeNull();
  });

  it('should return correct no cases found message', () => {
    component.totalCases = 0;
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.selectedFilterType = CaaCasesFilterType.None;
    expect(component.getNoCasesFoundMessage()).toEqual(CaaCasesNoDataMessage.NoUnassignedCases);
    component.selectedFilterType = CaaCasesFilterType.CaseReferenceNumber;
    expect(component.getNoCasesFoundMessage()).toEqual(CaaCasesNoDataMessage.UnassignedCasesFilterMessage);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.selectedFilterType = CaaCasesFilterType.AllAssignees;
    expect(component.getNoCasesFoundMessage()).toEqual(CaaCasesNoDataMessage.NoAssignedCases);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.selectedFilterType = CaaCasesFilterType.CaseReferenceNumber;
    expect(component.getNoCasesFoundMessage()).toEqual(CaaCasesNoDataMessage.AssignedCasesFilterMessage);
    component.selectedFilterType = CaaCasesFilterType.AssigneeName;
    expect(component.getNoCasesFoundMessage()).toEqual(CaaCasesNoDataMessage.AssignedCasesFilterMessage);
    component.totalCases = 1;
    expect(component.getNoCasesFoundMessage()).toEqual('');
  });

  it('should onSelectedFilterTypeChanged set selected filter type', () => {
    component.onSelectedFilterTypeChanged(CaaCasesFilterType.CaseReferenceNumber);
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.CaseReferenceNumber);
  });

  it('should onSelectedFilterValueChanged set selected filter value, selected filter type and call loadCaseTypes', () => {
    spyOn(component, 'loadCaseTypes');
    spyOn(component, 'storeSessionState');
    spyOn(component, 'removeSessionState');
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.onSelectedFilterValueChanged('1111222233334444');
    expect(component.selectedFilterValue).toEqual('1111222233334444');
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.CaseReferenceNumber);
    expect(component.loadCaseTypes).toHaveBeenCalled();
    expect(component.storeSessionState).toHaveBeenCalled();
    component.onSelectedFilterValueChanged(null);
    expect(component.selectedFilterValue).toEqual(null);
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.None);
    expect(component.loadCaseTypes).toHaveBeenCalled();
    expect(component.removeSessionState).toHaveBeenCalled();
  });

  it('should remove session state', () => {
    component.removeSessionState(CaaCasesFilterType.AssigneeName);
    expect(caaCasesService.removeSessionState).toHaveBeenCalledWith(CaaCasesFilterType.AssigneeName);
  });

  it('should retrieve session state', () => {
    spyOn(component, 'toggleFilterSection');
    caaCasesService.retrieveSessionState.and.returnValue(sessionState.value);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.retrieveSessionState();
    expect(component.sessionStateValue).toEqual(sessionStateValue);
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.AssigneeName);
    expect(component.selectedFilterValue).toEqual('assignee123');
    expect(component.toggleFilterSection).toHaveBeenCalled();
  });

  it('should store session state', () => {
    caaCasesService.retrieveSessionState.and.returnValue(sessionState.value);
    component.storeSessionState();
    expect(caaCasesService.storeSessionState).toHaveBeenCalled();
  });

  it('should submit assigned and unassigned share cases', () => {
    const storeDispatchMock = spyOn(store, 'dispatch');
    component.currentCaseType = 'Asylum';
    component.selectedAssignedCases = [{ case_id: '1', case_title: 'Assigned case' }];
    component.selectedUnassignedCases = [{ case_id: '2', case_title: 'Unassigned case' }];

    component.shareAssignedCaseSubmit();
    component.shareUnassignedCaseSubmit();

    expect(storeDispatchMock).toHaveBeenCalledWith(jasmine.any(fromStore.AddShareAssignedCases));
    expect(storeDispatchMock).toHaveBeenCalledWith(jasmine.any(fromStore.AddShareUnassignedCases));
  });

  it('should synchronize selected cases for assigned and unassigned pages', () => {
    const storeDispatchMock = spyOn(store, 'dispatch');
    const selectedCases = [{ case_id: '1', case_title: 'Selected case' }];
    component.currentCaseType = 'Asylum';

    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.onCaseSelection(selectedCases);
    expect(component.selectedUnassignedCases).toEqual(selectedCases);
    expect(storeDispatchMock).toHaveBeenCalledWith(jasmine.any(fromStore.SynchronizeStateToStoreUnassignedCases));

    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.onCaseSelection(selectedCases);
    expect(component.selectedAssignedCases).toEqual(selectedCases);
    expect(storeDispatchMock).toHaveBeenCalledWith(jasmine.any(fromStore.SynchronizeStateToStoreAssignedCases));
  });

  it('should update tab and pagination state', () => {
    spyOn(component as any, 'setTabItems');
    component.navItems = [
      { text: 'Asylum', total: 7 },
      { text: 'Civil', total: 3 }
    ];

    component.tabChanged({ tab: { textLabel: 'Civil' } });
    expect(component.totalCases).toEqual(3);
    expect((component as any).setTabItems).toHaveBeenCalledWith('Civil', true);

    component.tabChanged({ tab: { textLabel: 'Unknown' } });
    expect(component.totalCases).toEqual(0);

    spyOn(component, 'loadDataFromStore');
    component.onPaginationHandler(4);
    expect(component.currentPageNo).toEqual(4);
    expect(component.loadDataFromStore).toHaveBeenCalled();
  });

  it('should return result counts and pagination bounds', () => {
    component.totalCases = 51;
    component.currentPageNo = 2;
    component.paginationPageSize = 25;

    expect(component.hasResults()).toEqual(51);
    expect(component.getFirstResult()).toEqual(26);
    expect(component.getLastResult()).toEqual(50);
    expect(component.getTotalResults()).toEqual(51);

    component.currentPageNo = 3;
    expect(component.getLastResult()).toEqual(51);
  });

  it('should toggle filter text for unassigned and assigned pages', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.caaShowHideFilterButtonText = CaaCasesShowHideFilterButtonText.UnassignedCasesShow;
    component.toggleFilterSection();
    expect(component.caaShowHideFilterButtonText).toEqual(CaaCasesShowHideFilterButtonText.UnassignedCasesHide);
    component.toggleFilterSection();
    expect(component.caaShowHideFilterButtonText).toEqual(CaaCasesShowHideFilterButtonText.UnassignedCasesShow);

    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.caaShowHideFilterButtonText = CaaCasesShowHideFilterButtonText.AssignedCasesShow;
    component.toggleFilterSection();
    expect(component.caaShowHideFilterButtonText).toEqual(CaaCasesShowHideFilterButtonText.AssignedCasesHide);
    component.toggleFilterSection();
    expect(component.caaShowHideFilterButtonText).toEqual(CaaCasesShowHideFilterButtonText.AssignedCasesShow);
  });

  it('should load assigned case data from store', () => {
    const storeDispatchMock = spyOn(store, 'dispatch');
    spyOn(store, 'pipe').and.returnValue(of([]));
    const routerUrlPropertySpy = spyOnProperty(router, 'url', 'get').and.returnValue('/assigned-cases');
    component.currentCaseType = 'Asylum';
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;

    component.loadDataFromStore();

    expect(storeDispatchMock).toHaveBeenCalledWith(jasmine.any(fromStore.LoadAssignedCases));
    expect(component.noCasesFoundMessage).toEqual(component.getNoCasesFoundMessage());
    routerUrlPropertySpy.and.callThrough();
  });

  it('should handle empty case types and reset current tab', () => {
    spyOn(component, 'loadDataFromStore');
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.tabGroup = { selectedIndex: 2 } as any;

    (component as any).fixCurrentTab([]);
    expect(component.totalCases).toEqual(0);
    expect(component.noCasesFoundMessage).toEqual(component.getNoCasesFoundMessage());

    (component as any).fixCurrentTab([{ text: 'Asylum', total: 4 }]);
    expect(component.totalCases).toEqual(4);
    expect(component.currentCaseType).toEqual('Asylum');
    expect(component.tabGroup.selectedIndex).toEqual(0);
    expect(component.loadDataFromStore).toHaveBeenCalled();
  });

  it('should handle session state edge cases and selected filter values', () => {
    spyOn(component, 'toggleFilterSection');
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    caaCasesService.retrieveSessionState.and.returnValue(null);
    component.retrieveSessionState();
    expect(component.toggleFilterSection).not.toHaveBeenCalled();

    caaCasesService.retrieveSessionState.and.returnValue({ filterType: null } as any);
    component.retrieveSessionState();
    expect(component.selectedFilterType).toBeNull();

    caaCasesService.retrieveSessionState.and.returnValue({
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      caseReferenceNumber: '1234567812345678',
      assigneeName: null
    });
    component.retrieveSessionState();
    expect(component.selectedFilterValue).toEqual('1234567812345678');

    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    caaCasesService.retrieveSessionState.and.returnValue({
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      caseReferenceNumber: '8765432187654321',
      assigneeName: null
    });
    component.retrieveSessionState();
    expect(component.selectedFilterValue).toEqual('8765432187654321');
  });

  it('should set errors and track repeated display items', () => {
    const errors = [{ title: '', description: 'Problem', fieldId: 'field' }];
    component.onErrorMessages(errors);
    expect(component.errorMessages).toEqual(errors);
    expect(component.isAnyError()).toBe(true);
    expect(component.trackByCaaErrorMessage(0, errors[0])).toEqual('field|Problem#0');
    expect(component.trackByNavItem(1, { id: 'tab-id', text: 'Asylum' })).toEqual('tab-id|Asylum#1');
  });
});
