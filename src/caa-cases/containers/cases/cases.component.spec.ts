import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesComponent } from './cases.component';
import { CaaCasesService } from 'src/caa-cases/services';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CaaCasesFilterType, CaaCasesPageType } from 'src/caa-cases/models/caa-cases.enum';
import * as caaCasesStore from '../../store';
import { of } from 'rxjs';

interface CasesComponentPrivateState {
  caaCasesPageType: CaaCasesPageType;
  selectedCases: unknown[];
}

describe('CaaCasesComponent', () => {
  let component: CasesComponent;
  let componentPrivateState: CasesComponentPrivateState;
  let fixture: ComponentFixture<CasesComponent>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;
  let mockStore: MockStore;

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
    await TestBed.configureTestingModule({
      declarations: [CasesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [provideMockStore(),
        { provide: CaaCasesService, useValue: caaCasesService }
      ],
      imports: [
        MatAutocompleteModule
      ]
    })
      .compileComponents();

    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CasesComponent);
    component = fixture.componentInstance;
    componentPrivateState = component as unknown as CasesComponentPrivateState;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load case types and load data for the first returned case type', () => {
    spyOn(component, 'loadCaseData');
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    spyOn(mockStore, 'pipe').and.returnValue(of([
      { text: 'Asylum', href: 'Asylum', active: false, total: 2 }
    ]));

    component.loadCaseTypes();

    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(caaCasesStore.LoadCaseTypes));
    expect(component.allCaseTypes).toEqual([{ text: 'Asylum', href: 'Asylum', active: false, total: 2 }]);
    expect(component.selectedCaseType).toEqual('Asylum');
    expect(component.loadCaseData).toHaveBeenCalled();
  });

  it('should dispatch assigned and unassigned case loads', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    component.allCaseTypes = [{ text: 'Asylum', href: 'Asylum', active: false, total: 2 }];
    component.selectedCaseType = 'Asylum';

    componentPrivateState.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.loadCaseData();
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(caaCasesStore.LoadAssignedCases));

    componentPrivateState.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.loadCaseData();
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(caaCasesStore.LoadUnassignedCases));
  });

  it('should update filter state for none, case reference, assignee and all assignees', () => {
    spyOn(component, 'loadCaseTypes');
    spyOn(component, 'storeSessionState');
    spyOn(component, 'removeSessionState');

    component.onSelectedFilter({ filterType: CaaCasesFilterType.None, filterValue: '' });
    expect(component.removeSessionState).toHaveBeenCalledWith(CaaCasesPageType.UnassignedCases);

    component.onSelectedFilter({ filterType: CaaCasesFilterType.CaseReferenceNumber, filterValue: '1234567812345678' });
    expect(component.caseResultsTableShareButtonText).toEqual('Accept and assign cases');

    component.onSelectedFilter({ filterType: CaaCasesFilterType.AssigneeName, filterValue: 'assignee-id' });
    expect(componentPrivateState.caaCasesPageType).toEqual(CaaCasesPageType.AssignedCases);
    expect(component.caseResultsTableShareButtonText).toEqual('Manage cases');

    component.onSelectedFilter({ filterType: CaaCasesFilterType.AllAssignees, filterValue: '' });
    expect(component.caseResultsTableShareButtonText).toEqual('Manage cases');
    expect(component.loadCaseTypes).toHaveBeenCalledTimes(4);
  });

  it('should manage errors, filter visibility and session state', () => {
    const errors = [{ title: '', description: 'Invalid', fieldId: 'field' }];
    component.onErrorMessages(errors);
    expect(component.errorMessages).toEqual(errors);
    expect(component.isAnyError()).toBe(true);

    component.toggleFilterSection();
    expect(component.showFilterSection).toBe(true);

    caaCasesService.retrieveSessionState.and.returnValue({
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      caseReferenceNumber: '1234567812345678',
      assigneeName: null
    });
    component.retrieveSessionState();
    expect(component.sessionStateValue.caseReferenceNumber).toEqual('1234567812345678');
    expect(component.showFilterSection).toBe(false);
  });

  it('should store session state for case reference and assignee filters', () => {
    componentPrivateState.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.storeSessionState({
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      filterValue: '1234567812345678'
    });
    expect(caaCasesService.storeSessionState).toHaveBeenCalledWith({
      key: CaaCasesPageType.AssignedCases,
      value: {
        filterType: CaaCasesFilterType.CaseReferenceNumber,
        caseReferenceNumber: '1234567812345678',
        assigneeName: null
      }
    });

    component.storeSessionState({
      filterType: CaaCasesFilterType.AssigneeName,
      filterValue: 'assignee-id'
    });
    expect(caaCasesService.storeSessionState).toHaveBeenCalledWith({
      key: CaaCasesPageType.AssignedCases,
      value: {
        filterType: CaaCasesFilterType.AssigneeName,
        caseReferenceNumber: null,
        assigneeName: 'assignee-id'
      }
    });
  });

  it('should synchronize selected assigned and unassigned cases', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    const selectedCases = [{ case_id: '1', case_title: 'A case' }];

    componentPrivateState.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.onCaseSelected(selectedCases);
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(caaCasesStore.SynchronizeStateToStoreAssignedCases));

    componentPrivateState.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.onCaseSelected(selectedCases);
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(caaCasesStore.SynchronizeStateToStoreUnassignedCases));
    expect(componentPrivateState.selectedCases).toEqual(selectedCases);
  });

  it('should load data when page changes and dispatch share actions', () => {
    spyOn(component, 'loadCaseData');
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    component.selectedCaseType = 'Asylum';
    component.onPageChanged(3);
    expect(component.currentPageNo).toEqual(3);
    expect(component.loadCaseData).toHaveBeenCalled();

    component.selectedFilterType = CaaCasesFilterType.CaseReferenceNumber;
    component.onShareButtonClicked();
    component.selectedFilterType = CaaCasesFilterType.AssigneeName;
    component.onShareButtonClicked();
    component.selectedFilterType = CaaCasesFilterType.AllAssignees;
    component.onShareButtonClicked();
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
  });
});
