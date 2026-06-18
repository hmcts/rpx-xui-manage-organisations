import { components } from './index';
import { CasesFilterComponent } from './cases-filter/cases-filter.component';
import { CasesResultsTableComponent } from './cases-results-table/cases-results-table.component';

describe('Cases components index', () => {
  it('should export the cases component list', () => {
    expect(components).toEqual([
      CasesFilterComponent,
      CasesResultsTableComponent
    ]);
  });
});
