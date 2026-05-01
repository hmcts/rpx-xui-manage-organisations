import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesComponent } from './cases.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CaaCasesService } from 'src/cases/services';
import * as organisationStore from '../../../organisation/store';
import { CaaCasesFilterType } from 'src/cases/models/caa-cases.enum';

describe('CasesComponent', () => {
  let component: CasesComponent;
  let fixture: ComponentFixture<CasesComponent>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;
  let store: MockStore;

  const createComponent = (): void => {
    fixture = TestBed.createComponent(CasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

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
});
