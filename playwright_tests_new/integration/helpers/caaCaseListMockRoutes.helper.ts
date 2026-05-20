import type { Page } from '@playwright/test';
import type {
  CaaCaseListRequest,
  CaaCaseTypesRequest
} from '../mocks/caseList.mock';
import {
  buildAssignedCaseTypesResponse,
  buildAssignedCasesResponse,
  buildUnassignedCasesResponse,
  buildUnassignedCaseTypesResponse
} from '../mocks/caseList.mock';
import { fulfillJson } from './manageOrgBaseRoutes.helper';

export interface CaaCaseListRouteState {
  caseListRequests: CaaCaseListRequest[];
  caseTypesRequests: CaaCaseTypesRequest[];
}

interface CaaCaseListRouteOptions {
  buildCaseTypesResponse: (options: CaaCaseListRequestOptions) => unknown;
  buildCasesResponse: (caseTypeId: string, options: CaaCaseListRequestOptions) => unknown;
  missingCaseTypeError: string;
}

interface CaaCaseListRequestOptions {
  caaCasesFilterType: string | null;
  caaCasesFilterValue: string | null;
}

const routeUrl = (requestUrl: string): URL => new URL(requestUrl);

export const setupCaaCaseListRoutes = async (
  page: Page,
  options: CaaCaseListRouteOptions
): Promise<CaaCaseListRouteState> => {
  const routeState: CaaCaseListRouteState = {
    caseListRequests: [],
    caseTypesRequests: []
  };

  await page.route('**/api/caaCaseTypes**', async (route) => {
    const url = routeUrl(route.request().url());
    const requestOptions = {
      caaCasesFilterType: url.searchParams.get('caaCasesFilterType'),
      caaCasesFilterValue: url.searchParams.get('caaCasesFilterValue')
    };

    routeState.caseTypesRequests.push({
      caaCasesFilterType: requestOptions.caaCasesFilterType,
      caaCasesFilterValue: requestOptions.caaCasesFilterValue,
      caaCasesPageType: url.searchParams.get('caaCasesPageType'),
      method: route.request().method()
    });

    await fulfillJson(route, options.buildCaseTypesResponse(requestOptions));
  });

  await page.route('**/api/caaCases**', async (route) => {
    const url = routeUrl(route.request().url());
    const caseTypeId = url.searchParams.get('caseTypeId');
    const requestOptions = {
      caaCasesFilterType: url.searchParams.get('caaCasesFilterType'),
      caaCasesFilterValue: url.searchParams.get('caaCasesFilterValue')
    };

    routeState.caseListRequests.push({
      caaCasesFilterType: requestOptions.caaCasesFilterType,
      caaCasesFilterValue: requestOptions.caaCasesFilterValue,
      caaCasesPageType: url.searchParams.get('caaCasesPageType'),
      caseTypeId,
      method: route.request().method(),
      pageNo: url.searchParams.get('pageNo'),
      pageSize: url.searchParams.get('pageSize')
    });

    if (!caseTypeId) {
      await fulfillJson(route, { error: options.missingCaseTypeError }, 400);
      return;
    }

    await fulfillJson(route, options.buildCasesResponse(caseTypeId, requestOptions));
  });

  return routeState;
};

export const setupAssignedCaseListRoutes = async (page: Page): Promise<CaaCaseListRouteState> =>
  setupCaaCaseListRoutes(page, {
    buildCaseTypesResponse: buildAssignedCaseTypesResponse,
    buildCasesResponse: buildAssignedCasesResponse,
    missingCaseTypeError: 'Missing assigned caseTypeId query parameter'
  });

export const setupUnassignedCaseListRoutes = async (page: Page): Promise<CaaCaseListRouteState> =>
  setupCaaCaseListRoutes(page, {
    buildCaseTypesResponse: buildUnassignedCaseTypesResponse,
    buildCasesResponse: buildUnassignedCasesResponse,
    missingCaseTypeError: 'Missing unassigned caseTypeId query parameter'
  });
