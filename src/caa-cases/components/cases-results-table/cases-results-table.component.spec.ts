import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesResultsTableComponent } from './cases-results-table.component';
import { CaaCasesService } from 'src/caa-cases/services';
import { provideMockStore } from '@ngrx/store/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('CasesResultsTableComponent', () => {
  let component: CasesResultsTableComponent;
  let fixture: ComponentFixture<CasesResultsTableComponent>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;

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
      declarations: [CasesResultsTableComponent],
      providers: [provideMockStore(),
        { provide: CaaCasesService, useValue: caaCasesService }
      ],
      imports: [
        MatAutocompleteModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CasesResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise tabs from case types', () => {
    component.allCaseTypes = [
      { id: 'case-type-1', text: 'Case Type 1', total: 5 }
    ] as any;

    expect(component.navItems.length).toBe(1);
    expect(component.totalCases).toBe(5);
    expect(component.currentCaseType).toBe('Case Type 1');
    expect(component.currentPageNo).toBe(1);
  });

  it('should reset totals when no case types are available', () => {
    component.allCaseTypes = [];

    expect(component.totalCases).toBe(0);
  });

  it('should set table config and cases inputs', () => {
    const tableConfig = {
      idField: 'id',
      columnConfigs: [{ key: 'caseReference', header: 'Case reference' }]
    } as any;
    const cases = [{ id: 'case-1' }];

    component.casesConfig = tableConfig;
    component.cases = cases;

    expect(component.tableConfig).toEqual(tableConfig);
    expect(component.cases).toEqual(cases as any);
  });

  it('should update totals when tabs change', () => {
    component.allCaseTypes = [
      { id: 'case-type-1', text: 'Case Type 1', total: 5 },
      { id: 'case-type-2', text: 'Case Type 2', total: 8 }
    ] as any;

    component.tabChanged({ tab: { textLabel: 'Case Type 2' } });

    expect(component.totalCases).toBe(8);
    expect(component.currentCaseType).toBe('Case Type 2');
    expect(component.currentPageNo).toBe(1);
  });

  it('should clear totals when a changed tab is not known', () => {
    component.allCaseTypes = [
      { id: 'case-type-1', text: 'Case Type 1', total: 5 }
    ] as any;

    component.tabChanged({ tab: { textLabel: 'Missing Type' } });

    expect(component.totalCases).toBe(0);
    expect(component.currentCaseType).toBe('Missing Type');
  });

  it('should calculate pagination result ranges', () => {
    component.paginationPageSize = 25;
    component.currentPageNo = 2;
    component.totalCases = 40;

    expect(component.hasResults()).toBe(40);
    expect(component.getFirstResult()).toBe(26);
    expect(component.getLastResult()).toBe(40);
    expect(component.getTotalResults()).toBe(40);

    component.totalCases = 80;

    expect(component.getLastResult()).toBe(50);
  });

  it('should emit case selection, page changes, and share clicks', () => {
    const caseSelectedSpy = spyOn(component.caseSelected, 'emit');
    const pageChangedSpy = spyOn(component.pageChanged, 'emit');
    const shareClickedSpy = spyOn(component.shareButtonClicked, 'emit');

    component.onCaseSelection([{ id: 'case-1' }]);
    component.onPaginationHandler(3);
    component.onShareButtonClicked();

    expect(caseSelectedSpy).toHaveBeenCalledWith([{ id: 'case-1' }]);
    expect(component.enableShareButton).toBeTrue();
    expect(component.currentPageNo).toBe(3);
    expect(pageChangedSpy).toHaveBeenCalledWith(3);
    expect(shareClickedSpy).toHaveBeenCalled();
  });
});
