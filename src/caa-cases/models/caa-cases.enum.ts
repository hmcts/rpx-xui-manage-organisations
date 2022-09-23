export enum CaaCasesPageType {
  AssignedCases = 'assigned-cases',
  UnassignedCases = 'unassigned-cases'
}

export enum CaaShowHideFilterButtonText {
  AssignedCasesShow = 'Show assigned cases filter',
  AssignedCasesHide = 'Hide assigned cases filter',
  UnassignedCasesShow = 'Show unassigned cases filter',
  UnassignedCasesHide = 'Hide unassigned cases filter'
}

export enum CaaCasesFilterType {
  AllAssignees = 'all-assignees',
  AssigneeName = 'assignee-name',
  CaseReferenceNumber = 'case-reference-number',
  None = 'none'
}

export enum CaaCasesPageTitle {
  AssignedCases = 'Assigned Cases',
  UnassignedCases = 'Unassigned Cases'
}

export enum CaaCasesFilterHeading {
  AssignedCases = 'Filter assigned cases',
  UnassignedCases = 'Search for an unassigned case'
}

export enum CaaCasesFilterErrorMessage {
  InvalidCaseReference = 'Enter a valid HMCTS case reference number',
  InvalidAssigneeName = 'Enter a valid assignee name'
}

export enum CaaCasesNoDataMessage {
  NoAssignedCases = 'There are no assigned cases available to be shared.',
  NoUnassignedCases = 'There are no unassigned cases available to be shared.',
  AssignedCasesFilterMessage = 'Try again using a different case reference or assignee.',
  UnassignedCasesFilterMessage = 'Try again using a different case reference.'
}
