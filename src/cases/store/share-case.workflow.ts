import { SharedCase, UserDetails } from '@hmcts/rpx-xui-common-lib';
import { CaaCasesPageType } from '../models/caa-cases.enum';

export function getShareCasePath(url: string, pageType: string, groupAccess?: boolean): string[] {
  if (groupAccess && pageType === CaaCasesPageType.NewCases) {
    return [`${url}/accept-cases`];
  }
  return [`${url}/case-share`];
}

export function getShareCasePageType(pageType: string): CaaCasesPageType {
  return pageType === CaaCasesPageType.UnassignedCases
    ? CaaCasesPageType.UnassignedCases
    : CaaCasesPageType.AssignedCases;
}

export function addUniqueCases(currentCases: SharedCase[], newCases: SharedCase[]): SharedCase[] {
  return newCases.reduce(
    (cases, aCase) =>
      cases.some((existingCase) => existingCase.caseId === aCase.caseId)
        ? cases
        : [...cases, aCase],
    [...currentCases]
  );
}

export function removeCaseById(cases: SharedCase[], caseId: string): SharedCase[] {
  return cases.filter((aCase) => aCase.caseId !== caseId);
}

export function mergeCasesWithTypes(casesInStore: SharedCase[], casesFromNode: SharedCase[]): SharedCase[] {
  return casesInStore.map((aCase) => {
    const intersectionCase = casesFromNode.find(
      (nodeCase) => nodeCase.caseId === aCase.caseId
    );

    if (!intersectionCase?.caseId) {
      return aCase;
    }

    return {
      ...intersectionCase,
      caseTypeId: aCase.caseTypeId ?? null,
      caseTitle: aCase.caseTitle ?? null
    };
  });
}

export function sortedUserInCases(pendingSortedCases: SharedCase[]): SharedCase[] {
  const cases: SharedCase[] = [];
  for (const aCase of pendingSortedCases) {
    if (aCase.sharedWith) {
      const sortedUsers: UserDetails[] = aCase.sharedWith.slice().sort((user1, user2) => {
        if (user1.firstName > user2.firstName) {
          return 1;
        }

        if (user1.firstName < user2.firstName) {
          return -1;
        }

        return 0;
      });
      cases.push({ ...aCase, sharedWith: sortedUsers });
    } else {
      cases.push(aCase);
    }
  }
  return cases;
}
