export enum CaaCasesPageType {
  AssignedCases = 'assigned-cases',
  UnassignedCases = 'unassigned-cases',
  NewCases = 'new-cases'
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
  CasesFilterMessage = 'There are no assigned cases associated with this user to be shared.',
  NoNewCases = 'There are no new cases to be shared.',
  NoCaseIdMatches = 'There are no cases with case reference to be shared.'
}
