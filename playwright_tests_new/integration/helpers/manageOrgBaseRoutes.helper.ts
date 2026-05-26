import type { Page, Route } from '@playwright/test';
import {
  manageOrgIntegrationOrganisation,
  manageOrgIntegrationUserDetails,
  manageOrgRuntimeConfiguration,
  manageOrgUsersWithoutRolesResponse
} from '../mocks/manageOrgIntegration.mock';

const manageOrgFeatureFlagsResponse = {
  'edit-permissions': {
    value: true,
    variation: 0,
    version: 1,
    flagVersion: 1
  },
  'mo-new-register-org': {
    value: true,
    variation: 0,
    version: 1,
    flagVersion: 1
  },
  $flagsState: {
    'edit-permissions': {
      variation: 0,
      version: 1
    },
    'mo-new-register-org': {
      variation: 0,
      version: 1
    }
  },
  $valid: true
};

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
  await page.route('https://app.launchdarkly.com/sdk/evalx/**', async (route) =>
    fulfillJson(route, manageOrgFeatureFlagsResponse)
  );

  await page.route('https://app.launchdarkly.com/sdk/eval/**', async (route) =>
    fulfillJson(route, manageOrgFeatureFlagsResponse)
  );

  await page.route('https://events.launchdarkly.com/**', async (route) =>
    route.fulfill({ status: 202, body: '' })
  );

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
