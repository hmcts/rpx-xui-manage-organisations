import type { Page, Route } from '@playwright/test';
import { manageOrgIntegrationOrganisation, manageOrgIntegrationUserDetails } from '../mocks/manageOrgIntegration.mock';
import { fulfillJson, setupManageOrgBaseRoutes } from './manageOrgBaseRoutes.helper';
import { setupOrganisationDetailsRoutes } from './organisationDetailsMockRoutes.helper';

export type AddressUpdateStatus = 204 | 400 | 401 | 403 | 500 | 502;

export interface AddressUpdateRouteState {
  updateRequests: { method: string; body: unknown }[];
  responseStatuses: AddressUpdateStatus[];
  updateStatus: AddressUpdateStatus;
}

export const setupAddressUpdateRoutes = async (page: Page, options: {
  updateStatus?: AddressUpdateStatus;
  userDetails?: typeof manageOrgIntegrationUserDetails;
  organisation?: typeof manageOrgIntegrationOrganisation & { pendingContactInformation?: boolean };
} = {}): Promise<AddressUpdateRouteState> => {
  const routeState: AddressUpdateRouteState = {
    updateRequests: [],
    responseStatuses: [],
    updateStatus: options.updateStatus ?? 204
  };
  await setupManageOrgBaseRoutes(page, { organisation: options.organisation });
  await setupOrganisationDetailsRoutes(page);
  await page.route('**/api/organisation/contact-information', async (route) => {
    const request = route.request();
    routeState.updateRequests.push({ method: request.method(), body: request.postDataJSON() });
    if (request.method() !== 'PUT') {
      await fulfillJson(route, { error: 'Expected PUT request' }, 405);
      return;
    }
    const status = routeState.updateStatus;
    if (status === 204) {
      await route.fulfill({ status });
    } else {
      await fulfillJson(route, { error: 'Address update rejected' }, status);
    }
    routeState.responseStatuses.push(status);
  });
  if (options.userDetails) {
    await page.unroute('**/api/user/details**');
    await page.route('**/api/user/details**', async (route) => fulfillJson(route, options.userDetails));
  }
  return routeState;
};

export const holdAddressUpdateUserDetails = async (page: Page): Promise<{ request: Promise<Route> }> => {
  let capture!: (route: Route) => void;
  const request = new Promise<Route>((resolve) => {
    capture = resolve;
  });
  await page.unroute('**/api/user/details**');
  await page.route('**/api/user/details**', (route) => {
    capture(route);
  });
  return { request };
};
