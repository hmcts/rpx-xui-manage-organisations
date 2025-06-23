import { CaaCasesFilterType } from './caa-cases.enum';

export interface SelectedCaseFilter {
  filterType: CaaCasesFilterType;
  filterValue: string;
}
