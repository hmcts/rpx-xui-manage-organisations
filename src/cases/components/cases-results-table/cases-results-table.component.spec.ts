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
});
