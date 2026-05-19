import type { Page } from '@playwright/test';
import type {
  CaseAssignmentsRequest,
  CaseSharingSharedCase
} from '../mocks/caseSharing.mock';
import {
  assignedCaseTypesResponse,
  asylumCaseType,
  buildCaseAssignmentSuccessResponse,
  buildAssignedCasesResponse,
  buildUnassignedCasesResponse,
  buildSharedCases,
  petSolicitorTwo,
  unassignedCaseTypesResponse
} from '../mocks/caseSharing.mock';
import { fulfillJson } from './manageOrgBaseRoutes.helper';

interface CaseTypesRequest {
  caaCasesFilterType: string | null;
  caaCasesPageType: string | null;
  method: string;
}

interface CaseListRequest extends CaseTypesRequest {
  caseTypeId: string | null;
  pageNo: string | null;
  pageSize: string | null;
}

export interface UnassignedCaseShareRouteState {
  assignmentResponses: CaseSharingSharedCase[][];
  caseListRequests: CaseListRequest[];
  caseTypesRequests: CaseTypesRequest[];
  loadedShareCaseIds: string[][];
  submittedAssignments: CaseAssignmentsRequest[];
}

export interface AssignedCaseRouteState {
  caseListRequests: CaseListRequest[];
  caseTypesRequests: CaseTypesRequest[];
}

const routeUrl = (requestUrl: string): URL => new URL(requestUrl);

export const setupUnassignedCaseShareRoutes = async (
  page: Page
): Promise<UnassignedCaseShareRouteState> => {
  const routeState: UnassignedCaseShareRouteState = {
    assignmentResponses: [],
    caseListRequests: [],
    caseTypesRequests: [],
    loadedShareCaseIds: [],
    submittedAssignments: []
  };

  await page.route('**/api/caaCaseTypes**', async (route) => {
    const url = routeUrl(route.request().url());

    routeState.caseTypesRequests.push({
      caaCasesFilterType: url.searchParams.get('caaCasesFilterType'),
      caaCasesPageType: url.searchParams.get('caaCasesPageType'),
      method: route.request().method()
    });

    await fulfillJson(route, unassignedCaseTypesResponse);
  });

  await page.route('**/api/caaCases**', async (route) => {
    const url = routeUrl(route.request().url());
    const caseTypeId = url.searchParams.get('caseTypeId');

    routeState.caseListRequests.push({
      caaCasesFilterType: url.searchParams.get('caaCasesFilterType'),
      caaCasesPageType: url.searchParams.get('caaCasesPageType'),
      caseTypeId,
      method: route.request().method(),
      pageNo: url.searchParams.get('pageNo'),
      pageSize: url.searchParams.get('pageSize')
    });

    if (!caseTypeId) {
      await fulfillJson(route, { error: 'Missing caseTypeId query parameter' }, 400);
      return;
    }

    await fulfillJson(route, buildUnassignedCasesResponse(caseTypeId));
  });

  await page.route('**/api/caseshare/cases**', async (route) => {
    const url = routeUrl(route.request().url());
    const caseIds = (url.searchParams.get('case_ids') ?? '')
      .split(',')
      .filter(Boolean);

    routeState.loadedShareCaseIds.push(caseIds);

    await fulfillJson(route, buildSharedCases(caseIds));
  });

  await page.route('**/api/caseshare/users**', async (route) =>
    fulfillJson(route, [petSolicitorTwo])
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

export const setupAssignedCaseRoutes = async (page: Page): Promise<AssignedCaseRouteState> => {
  const routeState: AssignedCaseRouteState = {
    caseListRequests: [],
    caseTypesRequests: []
  };

  await page.route('**/api/caaCaseTypes**', async (route) => {
    const url = routeUrl(route.request().url());

    routeState.caseTypesRequests.push({
      caaCasesFilterType: url.searchParams.get('caaCasesFilterType'),
      caaCasesPageType: url.searchParams.get('caaCasesPageType'),
      method: route.request().method()
    });

    await fulfillJson(route, assignedCaseTypesResponse);
  });

  await page.route('**/api/caaCases**', async (route) => {
    const url = routeUrl(route.request().url());
    const caseTypeId = url.searchParams.get('caseTypeId') ?? asylumCaseType;

    routeState.caseListRequests.push({
      caaCasesFilterType: url.searchParams.get('caaCasesFilterType'),
      caaCasesPageType: url.searchParams.get('caaCasesPageType'),
      caseTypeId,
      method: route.request().method(),
      pageNo: url.searchParams.get('pageNo'),
      pageSize: url.searchParams.get('pageSize')
    });

    await fulfillJson(route, buildAssignedCasesResponse(caseTypeId));
  });

  return routeState;
};
