import {
  assignedCaseRows,
  assignedCaseIds,
  unassignedCaseRows
} from './caseList.mock';
import {
  type CaseShareUser,
  petSolicitorOne,
  petSolicitorTwo
} from './caseSharingUsers.mock';

export type { CaseShareUser } from './caseSharingUsers.mock';
export {
  buildRecipientName,
  buildRecipientOptionName,
  petSolicitorOne,
  petSolicitorTwo
} from './caseSharingUsers.mock';
export {
  assignedAsylumCase,
  assignedCaseIds,
  assignedCaseRows,
  assignedCaseTypesResponse,
  assignedImmigrationCase,
  assignedSecondAsylumCase,
  asylumCaseType,
  buildAssignedCaseTypesResponse,
  buildAssignedCasesResponse,
  buildCaseTypesResponse,
  buildUnassignedCasesResponse,
  buildUnassignedCaseTypesResponse,
  immigrationCaseType,
  unassignedAsylumCase,
  unassignedCaseIds,
  unassignedCaseRows,
  unassignedCaseTypesResponse,
  unassignedImmigrationCase,
  unassignedImmigrationCaseId,
  unassignedSecondAsylumCase
} from './caseList.mock';
export {
  manageOrgIntegrationOrganisationIdentifier,
  manageOrgIntegrationOrganisationName,
  manageOrgIntegrationOrganisation,
  manageOrgIntegrationUserDetails,
  manageOrgRuntimeConfiguration,
  manageOrgUsersWithoutRolesResponse
} from './manageOrgIntegration.mock';

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

export interface BuildSharedCasesOptions {
  existingAccess?: Record<string, CaseShareUser[]>;
}

const allCaseRows = [...assignedCaseRows, ...unassignedCaseRows];
const assignedExistingAccess: Record<string, CaseShareUser[]> = {
  [assignedCaseIds[0]]: [petSolicitorOne],
  [assignedCaseIds[1]]: [petSolicitorOne]
};

export const buildSharedCases = (
  caseIds: string[],
  options: BuildSharedCasesOptions = {}
): CaseSharingSharedCase[] =>
  caseIds.map((caseId) => {
    const caseRow = allCaseRows.find((row) => row.case_id === caseId);

    if (!caseRow) {
      throw new Error(`No mocked case row exists for case ID ${caseId}`);
    }

    return {
      caseId,
      caseTitle: caseRow.case_title,
      caseTypeId: caseRow.caseType,
      sharedWith: options.existingAccess?.[caseId] ?? [],
      pendingShares: [],
      pendingUnshares: []
    };
  });

export const buildAssignedSharedCases = (caseIds: string[]): CaseSharingSharedCase[] =>
  buildSharedCases(caseIds, { existingAccess: assignedExistingAccess });

export const buildUnassignedSharedCases = (
  caseIds: string[],
  options: BuildSharedCasesOptions = {}
): CaseSharingSharedCase[] =>
  buildSharedCases(caseIds, options);

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

export const caseShareAssignableUsers = [petSolicitorTwo];
