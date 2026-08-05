import { CasesResultsTableComponent } from './cases-results-table.component';

describe('CasesCasesResultsTableComponent', () => {
  let component: CasesResultsTableComponent;

  beforeEach(() => {
    component = new CasesResultsTableComponent({} as any);
  });

  it('should emit the initial case type when case type tabs are set', () => {
    const emitSpy = spyOn(component.tabChangedValue, 'emit');

    component.allCaseTypes = [
      { id: 'case-type-1', text: 'Case Type 1', total: 1 }
    ] as any;

    expect(emitSpy.calls.count()).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith('Case Type 1');
  });

  it('should not emit again when Material reports the already-selected tab', () => {
    const emitSpy = spyOn(component.tabChangedValue, 'emit');

    component.allCaseTypes = [
      { id: 'case-type-1', text: 'Case Type 1', total: 1 }
    ] as any;
    component.tabChanged({ tab: { textLabel: 'Case Type 1' } });

    expect(emitSpy.calls.count()).toBe(1);
  });

  it('should emit when the user selects a different tab', () => {
    const emitSpy = spyOn(component.tabChangedValue, 'emit');

    component.allCaseTypes = [
      { id: 'case-type-1', text: 'Case Type 1', total: 1 },
      { id: 'case-type-2', text: 'Case Type 2', total: 2 }
    ] as any;
    component.tabChanged({ tab: { textLabel: 'Case Type 2' } });

    expect(emitSpy.calls.allArgs()).toEqual([
      ['Case Type 1'],
      ['Case Type 2']
    ]);
  });

  it('should set case data and table config from inputs', () => {
    component.cases = [{ case_id: '1' }];
    component.casesConfig = {
      idField: 'case_id',
      columnConfigs: [{ header: 'Case ID', key: 'case_id' }]
    } as any;

    expect(component.cases).toEqual([{ case_id: '1' }] as any);
    expect(component.tableConfig).toEqual({
      idField: 'case_id',
      columnConfigs: [{ header: 'Case ID', key: 'case_id' }]
    } as any);
  });

  it('should handle empty case type tabs', () => {
    component.selectedFilterType = 'unassigned-cases';
    component.allCaseTypes = [];

    expect(component.totalCases).toEqual(0);
    expect(component.noCasesFoundMessage).toContain('There are no unassigned cases');
  });

  it('should return pagination result counts', () => {
    component.currentPageNo = 2;
    component.paginationPageSize = 25;
    component.totalCases = 60;

    expect(component.hasResults()).toEqual(60);
    expect(component.getFirstResult()).toEqual(26);
    expect(component.getLastResult()).toEqual(50);
    expect(component.getTotalResults()).toEqual(60);

    component.currentPageNo = 3;
    expect(component.getLastResult()).toEqual(60);
  });

  it('should emit selected cases and update share button state', () => {
    const emitSpy = spyOn(component.caseSelected, 'emit');

    component.onCaseSelection([{ case_id: '1' }]);
    expect(emitSpy).toHaveBeenCalledWith([{ case_id: '1' }]);
    expect(component.enableShareButton).toBe(true);

    component.onCaseSelection([]);
    expect(component.enableShareButton).toBe(false);
  });

  it('should emit pagination and share button events', () => {
    spyOn(component.pageChanged, 'emit');
    spyOn(component.shareButtonClicked, 'emit');
    component.currentCaseType = 'Asylum';

    component.onPaginationHandler(4);
    component.onShareButtonClicked();

    expect(component.currentPageNo).toEqual(4);
    expect(component.pageChanged.emit).toHaveBeenCalledWith(4);
    expect(component.shareButtonClicked.emit).toHaveBeenCalledWith('Asylum');
  });

  it('should reset tab group on initial tab setup', () => {
    component.tabGroup = { selectedIndex: 3 } as any;

    component.allCaseTypes = [
      { id: 'case-type-1', text: 'Case Type 1', total: 1 }
    ] as any;

    expect(component.tabGroup.selectedIndex).toEqual(0);
    expect(component.selectedCases).toEqual([]);
  });

  it('should return no cases messages by selected filter type', () => {
    component.selectedFilterType = 'all-assignees';
    expect(component.getNoCasesFoundMessage()).toContain('There are no assigned cases');
    component.selectedFilterType = 'assignee-name';
    expect(component.getNoCasesFoundMessage()).toContain('There are no assigned cases associated with this user');
    component.selectedFilterType = 'new-cases-to-accept';
    expect(component.getNoCasesFoundMessage()).toContain('There are no new cases');
    component.selectedFilterType = 'case-reference-number';
    expect(component.getNoCasesFoundMessage()).toContain('There are no cases with case reference');
    component.selectedFilterType = 'unknown';
    expect(component.getNoCasesFoundMessage()).toEqual('');
  });
});
