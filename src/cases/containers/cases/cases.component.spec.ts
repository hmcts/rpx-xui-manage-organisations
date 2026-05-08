import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesComponent } from './cases.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CaaCasesService } from 'src/cases/services';
import * as organisationStore from '../../../organisation/store';
import * as caaCasesStore from '../../store';
import { CaaCasesFilterType } from 'src/cases/models/caa-cases.enum';

describe('CasesComponent', () => {
  let component: CasesComponent;
  let fixture: ComponentFixture<CasesComponent>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

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
    await TestBed.configureTestingModule({
      declarations: [CasesComponent],
      providers: [provideMockStore(),
        { provide: CaaCasesService, useValue: caaCasesService }
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
});
