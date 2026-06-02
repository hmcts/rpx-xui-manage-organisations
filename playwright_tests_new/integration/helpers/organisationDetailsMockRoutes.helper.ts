import type { Page } from '@playwright/test';
import { organisationTypeLovResponse } from '../mocks/registerOrganisation.mock';
import { fulfillJson } from './manageOrgBaseRoutes.helper';

interface OrganisationDetailsLovRequest {
  categoryId: string | null;
  isChildRequired: string | null;
  method: string;
  serviceId: string | null;
}

export interface OrganisationDetailsRouteState {
  lovRequests: OrganisationDetailsLovRequest[];
}

const routeUrl = (requestUrl: string): URL => new URL(requestUrl);

export const setupOrganisationDetailsRoutes = async (page: Page): Promise<OrganisationDetailsRouteState> => {
  const routeState: OrganisationDetailsRouteState = {
    lovRequests: []
  };

  await page.route('**/external/getLovRefData**', async (route) => {
    const url = routeUrl(route.request().url());
    const categoryId = url.searchParams.get('categoryId');

    routeState.lovRequests.push({
      categoryId,
      isChildRequired: url.searchParams.get('isChildRequired'),
      method: route.request().method(),
      serviceId: url.searchParams.get('serviceId')
    });

    await fulfillJson(route, categoryId === 'OrgType' ? organisationTypeLovResponse : []);
  });

  return routeState;
};
