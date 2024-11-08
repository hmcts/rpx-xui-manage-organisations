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
  caseConfig: {
    new_cases: boolean;
    group_access: boolean;
  }
}

export interface SelectedCases {
  [key: string]: string [];
}

export interface CaaCasesSessionStateValue {
  filterType: string;
  caseReferenceNumber?: string;
  assigneeName?: string;
}

export interface CaaCasesSessionState {
  key: string;
  value: CaaCasesSessionStateValue;
}
