import type { Page, Route } from '@playwright/test';
import {
  manageOrgIntegrationOrganisation,
  manageOrgIntegrationUserDetails,
  manageOrgRuntimeConfiguration,
  manageOrgUsersWithoutRolesResponse
} from '../mocks/caseSharing.mock';

export const fulfillJson = async (
  route: Route,
  body: unknown,
  status = 200
): Promise<void> => route.fulfill({
  status,
  contentType: 'application/json',
  body: JSON.stringify(body)
});

export const setupManageOrgBaseRoutes = async (page: Page): Promise<void> => {
  await page.route('**/external/configuration-ui/**', async (route) =>
    fulfillJson(route, manageOrgRuntimeConfiguration)
  );

  await page.route('**/auth/isAuthenticated', async (route) => fulfillJson(route, true));

  await page.route('**/api/user/details**', async (route) =>
    fulfillJson(route, manageOrgIntegrationUserDetails)
  );

  await page.route('**/api/healthCheck**', async (route) =>
    fulfillJson(route, { healthState: true })
  );

  await page.route('**/api/organisation**', async (route) =>
    fulfillJson(route, manageOrgIntegrationOrganisation)
  );

  await page.route('**/api/allUserListWithoutRoles**', async (route) =>
    fulfillJson(route, manageOrgUsersWithoutRolesResponse)
  );
};
