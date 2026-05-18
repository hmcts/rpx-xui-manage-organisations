import type { Page } from '@playwright/test';
import type {
  CaseAssignmentsRequest,
  CaseSharingSharedCase
} from '../mocks/caseSharing.mock';
import {
  buildAssignedSharedCases,
  buildCaseAssignmentSuccessResponse,
  buildUnassignedSharedCases,
  caseShareAssignableUsers
} from '../mocks/caseSharing.mock';
import { fulfillJson } from './manageOrgBaseRoutes.helper';
import {
  type CaaCaseListRouteState,
  setupAssignedCaseListRoutes,
  setupUnassignedCaseListRoutes
} from './caaCaseListMockRoutes.helper';

interface CaseShareRouteOnlyState {
  assignmentResponses: CaseSharingSharedCase[][];
  loadedShareCaseIds: string[][];
  submittedAssignments: CaseAssignmentsRequest[];
}

export type CaseShareRouteState = CaaCaseListRouteState & CaseShareRouteOnlyState;
export type UnassignedCaseShareRouteState = CaseShareRouteState;
export type AssignedCaseShareRouteState = CaseShareRouteState;
export type AssignedCaseRouteState = CaaCaseListRouteState;

const routeUrl = (requestUrl: string): URL => new URL(requestUrl);

const setupCaseShareRoutes = async (
  page: Page,
  buildSharedCases: (caseIds: string[]) => CaseSharingSharedCase[]
): Promise<CaseShareRouteOnlyState> => {
  const routeState: CaseShareRouteOnlyState = {
    assignmentResponses: [],
    loadedShareCaseIds: [],
    submittedAssignments: []
  };

  await page.route('**/api/caseshare/cases**', async (route) => {
    const url = routeUrl(route.request().url());
    const caseIds = (url.searchParams.get('case_ids') ?? '')
      .split(',')
      .filter(Boolean);

    routeState.loadedShareCaseIds.push(caseIds);

    await fulfillJson(route, buildSharedCases(caseIds));
  });

  await page.route('**/api/caseshare/users**', async (route) =>
    fulfillJson(route, caseShareAssignableUsers)
  );

  await page.route('**/api/caseshare/case-assignments**', async (route) => {
    const body = route.request().postDataJSON() as CaseAssignmentsRequest;
    const responseBody = buildCaseAssignmentSuccessResponse(body.sharedCases);

    routeState.submittedAssignments.push(body);
    routeState.assignmentResponses.push(responseBody);

    await fulfillJson(route, responseBody);
  });

  return routeState;
};

export const setupUnassignedCaseShareRoutes = async (
  page: Page
): Promise<UnassignedCaseShareRouteState> => ({
  ...(await setupUnassignedCaseListRoutes(page)),
  ...(await setupCaseShareRoutes(page, buildUnassignedSharedCases))
});

export const setupAssignedCaseShareRoutes = async (
  page: Page
): Promise<AssignedCaseShareRouteState> => ({
  ...(await setupAssignedCaseListRoutes(page)),
  ...(await setupCaseShareRoutes(page, buildAssignedSharedCases))
});

export const setupAssignedCaseRoutes = async (page: Page): Promise<AssignedCaseRouteState> =>
  setupAssignedCaseListRoutes(page);
