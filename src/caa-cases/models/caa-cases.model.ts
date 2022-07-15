export interface CaaCasesColumnConfig {
  header: string;
  key: string;
  type: string;
}

export interface CaaCases {
  idField: string;
  columnConfigs: CaaCasesColumnConfig [];
  data: any[];
}

export interface CaseTypesResultsResponse {
  total: number;
  cases: any[];
  case_types_results?: CaseTypesResults [];
}

export interface CaseTypesResults {
  total: number;
  case_type_id: string;
}

export interface SelectedCases {
  [key: string]: string [];
}
