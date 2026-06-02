import type { Page, Route } from '@playwright/test';
import type {
  BuildSharedCasesOptions,
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
  caseAssignmentRequests: CaseShareAssignmentRouteRequest[];
  caseShareCaseRequests: CaseShareCasesRouteRequest[];
  caseShareUserRequests: CaseShareUsersRouteRequest[];
  loadedShareCaseIds: string[][];
  submittedAssignments: CaseAssignmentsRequest[];
}

interface CaseShareAssignmentRouteRequest {
  method: string;
  sharedCaseIds: string[];
}

interface CaseShareCasesRouteRequest {
  caseIds: string[];
  method: string;
}

interface CaseShareUsersRouteRequest {
  method: string;
}

export type CaseShareRouteState = CaaCaseListRouteState & CaseShareRouteOnlyState;
export type UnassignedCaseShareRouteState = CaseShareRouteState;
export type AssignedCaseShareRouteState = CaseShareRouteState;
export type AssignedCaseRouteState = CaaCaseListRouteState;

const routeUrl = (requestUrl: string): URL => new URL(requestUrl);

const rejectUnexpectedMethod = async (
  route: Route,
  expectedMethod: 'GET' | 'POST'
): Promise<boolean> => {
  const method = route.request().method();

  if (method === expectedMethod) {
    return false;
  }

  await fulfillJson(route, { error: `Expected ${expectedMethod} request` }, 405);
  return true;
};

const setupCaseShareRoutes = async (
  page: Page,
  buildSharedCases: (caseIds: string[]) => CaseSharingSharedCase[]
): Promise<CaseShareRouteOnlyState> => {
  const routeState: CaseShareRouteOnlyState = {
    assignmentResponses: [],
    caseAssignmentRequests: [],
    caseShareCaseRequests: [],
    caseShareUserRequests: [],
    loadedShareCaseIds: [],
    submittedAssignments: []
  };

  await page.route('**/api/caseshare/cases**', async (route) => {
    const url = routeUrl(route.request().url());
    const caseIds = (url.searchParams.get('case_ids') ?? '')
      .split(',')
      .filter(Boolean);

    routeState.caseShareCaseRequests.push({
      caseIds,
      method: route.request().method()
    });

    if (await rejectUnexpectedMethod(route, 'GET')) {
      return;
    }

    routeState.loadedShareCaseIds.push(caseIds);

    await fulfillJson(route, buildSharedCases(caseIds));
  });

  await page.route('**/api/caseshare/users**', async (route) => {
    routeState.caseShareUserRequests.push({
      method: route.request().method()
    });

    if (await rejectUnexpectedMethod(route, 'GET')) {
      return;
    }

    await fulfillJson(route, caseShareAssignableUsers);
  });

  await page.route('**/api/caseshare/case-assignments**', async (route) => {
    if (await rejectUnexpectedMethod(route, 'POST')) {
      routeState.caseAssignmentRequests.push({
        method: route.request().method(),
        sharedCaseIds: []
      });
      return;
    }

    const body = route.request().postDataJSON() as CaseAssignmentsRequest;
    const responseBody = buildCaseAssignmentSuccessResponse(body.sharedCases);

    routeState.caseAssignmentRequests.push({
      method: route.request().method(),
      sharedCaseIds: body.sharedCases.map((sharedCase) => sharedCase.caseId)
    });
    routeState.submittedAssignments.push(body);
    routeState.assignmentResponses.push(responseBody);

    await fulfillJson(route, responseBody);
  });

  return routeState;
};

export const setupUnassignedCaseShareRoutes = async (
  page: Page,
  sharedCaseOptions: BuildSharedCasesOptions = {}
): Promise<UnassignedCaseShareRouteState> => ({
  ...(await setupUnassignedCaseListRoutes(page)),
  ...(await setupCaseShareRoutes(page, (caseIds) => buildUnassignedSharedCases(caseIds, sharedCaseOptions)))
});

export const setupAssignedCaseShareRoutes = async (
  page: Page
): Promise<AssignedCaseShareRouteState> => ({
  ...(await setupAssignedCaseListRoutes(page)),
  ...(await setupCaseShareRoutes(page, buildAssignedSharedCases))
});

export const setupAssignedCaseRoutes = async (page: Page): Promise<AssignedCaseRouteState> =>
  setupAssignedCaseListRoutes(page);
