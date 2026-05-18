export interface CaaCaseListRequest {
  caaCasesFilterType: string | null;
  caaCasesFilterValue: string | null;
  caaCasesPageType: string | null;
  caseTypeId: string | null;
  method: string;
  pageNo: string | null;
  pageSize: string | null;
}

export interface CaaCaseTypesRequest {
  caaCasesFilterType: string | null;
  caaCasesFilterValue: string | null;
  caaCasesPageType: string | null;
  method: string;
}

interface BuildCaseListResponseOptions {
  caaCasesFilterType?: string | null;
  caaCasesFilterValue?: string | null;
}

export const asylumCaseType = 'Asylum';
export const immigrationCaseType = 'Immigration';
export const unassignedCaseIds = ['1234567812345681', '1234567812345682'];
export const unassignedImmigrationCaseId = '1234567812345683';
export const assignedCaseIds = ['1234567812345671', '1234567812345672'];

export const assignedAsylumCase = {
  caseReference: assignedCaseIds[0],
  caseNumber: '6042070/2023',
  claimant: 'Grayson Becker',
  respondent: 'Mrs Test Auto',
  state: 'Accepted',
  caseType: asylumCaseType,
  caseTitle: assignedCaseIds[0]
};

export const assignedImmigrationCase = {
  caseReference: assignedCaseIds[1],
  caseNumber: '6042071/2023',
  claimant: 'Grayson Becker',
  respondent: 'Mrs Test Auto',
  state: 'Accepted',
  caseType: immigrationCaseType,
  caseTitle: assignedCaseIds[1]
};

export const unassignedAsylumCase = {
  caseReference: unassignedCaseIds[0],
  caseNumber: '6042072/2023',
  claimant: 'Riley Harper',
  respondent: 'Secretary of State',
  state: 'Case created',
  caseType: asylumCaseType,
  caseTitle: 'Asylum appeal 5681'
};

export const unassignedSecondAsylumCase = {
  caseReference: unassignedCaseIds[1],
  caseNumber: '6042073/2023',
  claimant: 'Morgan Drew',
  respondent: 'Secretary of State',
  state: 'Case created',
  caseType: asylumCaseType,
  caseTitle: 'Asylum appeal 5682'
};

export const unassignedImmigrationCase = {
  caseReference: unassignedImmigrationCaseId,
  caseNumber: '6042074/2023',
  claimant: 'Taylor Quinn',
  respondent: 'Secretary of State',
  state: 'Case created',
  caseType: immigrationCaseType,
  caseTitle: 'Immigration appeal 5683'
};

const toCaseListRow = (mockCase: typeof assignedAsylumCase | typeof unassignedAsylumCase) => ({
  '[CASE_REFERENCE]': mockCase.caseReference,
  ethosCaseReference: mockCase.caseNumber,
  claimant: mockCase.claimant,
  respondent: mockCase.respondent,
  '[STATE]': mockCase.state,
  case_id: mockCase.caseReference,
  caseType: mockCase.caseType,
  case_title: mockCase.caseTitle
});

export const assignedCaseRows = [assignedAsylumCase, assignedImmigrationCase].map(toCaseListRow);
export const unassignedCaseRows = [
  unassignedAsylumCase,
  unassignedSecondAsylumCase,
  unassignedImmigrationCase
].map(toCaseListRow);

const filterCaseRows = (
  caseRows: typeof assignedCaseRows,
  options: BuildCaseListResponseOptions = {}
) => {
  if (options.caaCasesFilterType !== 'case-reference-number' || !options.caaCasesFilterValue) {
    return caseRows;
  }

  return caseRows.filter((caseRow) =>
    caseRow.case_id === options.caaCasesFilterValue
  );
};

export const buildCaseTypesResponse = (
  caseRows: typeof assignedCaseRows,
  options: BuildCaseListResponseOptions = {}
) => {
  const filteredCaseRows = filterCaseRows(caseRows, options);

  return {
    case_types_results: [
      {
        case_type_id: asylumCaseType,
        total: filteredCaseRows.filter((caseRow) => caseRow.caseType === asylumCaseType).length
      },
      {
        case_type_id: immigrationCaseType,
        total: filteredCaseRows.filter((caseRow) => caseRow.caseType === immigrationCaseType).length
      }
    ]
  };
};

export const assignedCaseTypesResponse = {
  case_types_results: [
    {
      case_type_id: asylumCaseType,
      total: assignedCaseRows.filter((assignedCase) => assignedCase.caseType === asylumCaseType).length
    },
    {
      case_type_id: immigrationCaseType,
      total: assignedCaseRows.filter((assignedCase) => assignedCase.caseType === immigrationCaseType).length
    }
  ]
};

export const unassignedCaseTypesResponse = {
  case_types_results: [
    {
      case_type_id: asylumCaseType,
      total: unassignedCaseRows.filter((unassignedCase) => unassignedCase.caseType === asylumCaseType).length
    },
    {
      case_type_id: immigrationCaseType,
      total: unassignedCaseRows.filter((unassignedCase) => unassignedCase.caseType === immigrationCaseType).length
    }
  ]
};

export const buildCaseListResponse = (
  caseTypeId: string,
  caseRows: typeof assignedCaseRows,
  options: BuildCaseListResponseOptions = {}
) => ({
  idField: '[CASE_REFERENCE]',
  columnConfigs: [
    {
      header: 'Case Reference',
      key: '[CASE_REFERENCE]',
      type: 'TEXT'
    },
    {
      header: 'Case Number',
      key: 'ethosCaseReference',
      type: 'TEXT'
    },
    {
      header: 'Claimant',
      key: 'claimant',
      type: 'TEXT'
    },
    {
      header: 'Respondent',
      key: 'respondent',
      type: 'TEXT'
    },
    {
      header: 'State',
      key: '[STATE]',
      type: 'FixedList'
    }
  ],
  data: filterCaseRows(caseRows, options).filter((caseRow) => caseRow.caseType === caseTypeId)
});

export const buildAssignedCaseTypesResponse = (options: BuildCaseListResponseOptions = {}) =>
  buildCaseTypesResponse(assignedCaseRows, options);

export const buildUnassignedCaseTypesResponse = (options: BuildCaseListResponseOptions = {}) =>
  buildCaseTypesResponse(unassignedCaseRows, options);

export const buildAssignedCasesResponse = (
  caseTypeId: string,
  options: BuildCaseListResponseOptions = {}
) => buildCaseListResponse(caseTypeId, assignedCaseRows, options);

export const buildUnassignedCasesResponse = (
  caseTypeId: string,
  options: BuildCaseListResponseOptions = {}
) => buildCaseListResponse(caseTypeId, unassignedCaseRows, options);
