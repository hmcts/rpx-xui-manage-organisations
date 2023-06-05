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

export interface CaaCasesSessionStateValue {
  filterType: string;
  caseReferenceNumber?: string;
  assigneeName?: string;
}

export interface CaaCasesSessionState {
  key: string;
  value: CaaCasesSessionStateValue;
}

/**
 * Cloned from rpx-xui-webapp src/app/models/error-message.model.ts
 */
export interface ErrorMessage {
  title: string;
  description: string;
  fieldId?: string;
}
