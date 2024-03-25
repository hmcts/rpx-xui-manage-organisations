export enum CaaCasesPageType {
  AssignedCases = 'assigned-cases',
  UnassignedCases = 'unassigned-cases'
}

export enum CaaCasesShowHideFilterButtonText {
  AssignedCasesShow = 'Show assigned cases filter',
  AssignedCasesHide = 'Hide assigned cases filter',
  UnassignedCasesShow = 'Show unassigned cases filter',
  UnassignedCasesHide = 'Hide unassigned cases filter'
}

export enum CaaCasesFilterType {
  AllAssignedCases = 'all-assignees',
  CasesAssignedToAUser = 'assignee-name',
  CaseReferenceNumber = 'case-reference-number',
  NewCasesToAccept = 'new-cases-to-accept', // new enum
  UnassignedCases = 'unassigned-cases', // new enum
  None = 'none',
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
