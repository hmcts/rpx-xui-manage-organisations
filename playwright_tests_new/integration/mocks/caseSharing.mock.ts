export interface CaseShareUser {
  idamId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CaseSharingSharedCase {
  caseId: string;
  caseTitle: string;
  caseTypeId: string;
  sharedWith: CaseShareUser[];
  pendingShares?: CaseShareUser[];
  pendingUnshares?: CaseShareUser[];
}

export interface CaseAssignmentsRequest {
  sharedCases: CaseSharingSharedCase[];
}

export const manageOrgIntegrationOrganisationIdentifier = 'NPT8F21';
export const manageOrgIntegrationOrganisationName = 'Manage Org Integration Solicitors';

export const manageOrgRuntimeConfiguration = {
  idamWeb: 'https://idam.manage-org.integration.mock',
  manageCaseLink: 'https://manage-case.manage-org.integration.mock',
  manageOrgLink: 'http://localhost:4200',
  protocol: 'http',
  googleAnalyticsKey: '',
  termsAndConditionsEnabled: false
};

export const manageOrgIntegrationUserDetails = {
  email: 'manage-org.integration.admin@example.com',
  orgId: manageOrgIntegrationOrganisationIdentifier,
  roles: [
    'pui-caa',
    'pui-case-manager',
    'pui-org-manager',
    'pui-organisation-manager',
    'pui-user-manager',
    'task-supervisor',
    'case-allocator'
  ],
  sessionTimeout: {
    idleModalDisplayTime: 10,
    totalIdleTime: 20
  },
  userId: 'manage-org-integration-admin-id'
};

export const manageOrgIntegrationOrganisation = {
  name: manageOrgIntegrationOrganisationName,
  organisationIdentifier: manageOrgIntegrationOrganisationIdentifier,
  organisationProfileIds: [],
  contactInformation: [
    {
      addressLine1: '102 Petty France',
      townCity: 'London',
      postCode: 'SW1H 9AJ',
      dxAddress: []
    }
  ],
  status: 'ACTIVE',
  sraId: 'SRA123456',
  sraRegulated: true,
  superUser: {
    firstName: 'Manage',
    lastName: 'Org',
    email: manageOrgIntegrationUserDetails.email
  },
  paymentAccount: ['PBA1234567'],
  pendingAddPaymentAccount: [],
  pendingRemovePaymentAccount: []
};

export const petSolicitorTwo: CaseShareUser = {
  idamId: 'pet-solicitor-two-idam-id',
  email: 'div-petsol-2@example.com',
  firstName: 'Pet',
  lastName: 'Solicitor 2'
};

export const manageOrgUsersWithoutRolesResponse = {
  organisationIdentifier: manageOrgIntegrationOrganisationIdentifier,
  users: [
    {
      userIdentifier: manageOrgIntegrationUserDetails.userId,
      firstName: 'Manage',
      lastName: 'Org',
      email: manageOrgIntegrationUserDetails.email,
      idamStatus: 'ACTIVE'
    },
    {
      userIdentifier: petSolicitorTwo.idamId,
      firstName: petSolicitorTwo.firstName,
      lastName: petSolicitorTwo.lastName,
      email: petSolicitorTwo.email,
      idamStatus: 'ACTIVE'
    }
  ]
};

export const asylumCaseType = 'Asylum';
export const immigrationCaseType = 'Immigration';
export const unassignedCaseIds = ['1234567812345671', '1234567812345672'];
export const assignedCaseIds = ['1234567812345671', '1234567812345672'];

export const assignedAsylumCase = {
  caseReference: assignedCaseIds[0],
  caseNumber: '6042070/2023',
  claimant: 'Grayson Becker',
  respondent: 'Mrs Test Auto',
  state: 'Accepted',
  caseType: asylumCaseType
};

export const assignedImmigrationCase = {
  caseReference: assignedCaseIds[1],
  caseNumber: '6042071/2023',
  claimant: 'Grayson Becker',
  respondent: 'Mrs Test Auto',
  state: 'Accepted',
  caseType: immigrationCaseType
};

export const unassignedCaseRows = unassignedCaseIds.map((caseId) => ({
  '[CASE_REFERENCE]': caseId,
  case_id: caseId,
  caseType: asylumCaseType,
  case_title: `Asylum appeal ${caseId.slice(-4)}`
}));

export const assignedCaseRows = [assignedAsylumCase, assignedImmigrationCase].map((assignedCase) => ({
  '[CASE_REFERENCE]': assignedCase.caseReference,
  ethosCaseReference: assignedCase.caseNumber,
  claimant: assignedCase.claimant,
  respondent: assignedCase.respondent,
  '[STATE]': assignedCase.state,
  case_id: assignedCase.caseReference,
  caseType: assignedCase.caseType
}));

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
      total: unassignedCaseIds.length
    }
  ]
};

export const unassignedCasesResponse = {
  idField: '[CASE_REFERENCE]',
  columnConfigs: [
    {
      header: 'Case reference',
      key: '[CASE_REFERENCE]',
      type: 'text'
    },
    {
      header: 'Case name',
      key: 'case_title',
      type: 'text'
    }
  ],
  data: unassignedCaseRows
};

export const buildAssignedCasesResponse = (caseTypeId: string) => ({
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
  data: assignedCaseRows.filter((assignedCase) => assignedCase.caseType === caseTypeId)
});

export const buildSharedCases = (caseIds: string[]): CaseSharingSharedCase[] =>
  caseIds.map((caseId) => {
    const caseRow = unassignedCaseRows.find((row) => row.case_id === caseId);

    if (!caseRow) {
      throw new Error(`No mocked case row exists for case ID ${caseId}`);
    }

    return {
      caseId,
      caseTitle: caseRow.case_title,
      caseTypeId: caseRow.caseType,
      sharedWith: [],
      pendingShares: [],
      pendingUnshares: []
    };
  });

export const buildCaseAssignmentSuccessResponse = (
  sharedCases: CaseSharingSharedCase[]
): CaseSharingSharedCase[] =>
  sharedCases.map((sharedCase) => {
    const pendingShares = sharedCase.pendingShares ?? [];
    const pendingUnshares = sharedCase.pendingUnshares ?? [];
    const sharedWith = [...sharedCase.sharedWith, ...pendingShares].filter((user) =>
      pendingUnshares.every((pendingUnshare) => pendingUnshare.idamId !== user.idamId)
    );

    return {
      ...sharedCase,
      sharedWith,
      pendingShares: [],
      pendingUnshares: []
    };
  });
