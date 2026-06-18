import type { Page, Route } from '@playwright/test';
import {
  manageOrgIntegrationOrganisation,
  manageOrgIntegrationUserDetails,
  manageOrgRuntimeConfiguration,
  manageOrgUsersWithoutRolesResponse
} from '../mocks/manageOrgIntegration.mock';

type FeatureFlagOverrides = Record<string, boolean>;

interface SetupManageOrgBaseRoutesOptions {
  featureFlags?: FeatureFlagOverrides;
  organisation?: unknown;
  runtimeConfiguration?: Record<string, unknown>;
  usersWithoutRolesResponse?: unknown;
}

const manageOrgFeatureFlags = {
  'edit-permissions': {
    value: true,
    variation: 0,
    version: 1,
    flagVersion: 1
  },
  'mo-caa-menu-items': {
    value: true,
    variation: 0,
    version: 1,
    flagVersion: 1
  },
  'mo-new-cases': {
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
  }
};

const buildFeatureFlagsResponse = (overrides: FeatureFlagOverrides = {}) => {
  const featureFlags = Object.entries(overrides).reduce((flags, [flagName, value]) => ({
    ...flags,
    [flagName]: {
      value,
      variation: 0,
      version: 1,
      flagVersion: 1
    }
  }), manageOrgFeatureFlags);

  return {
    ...featureFlags,
    $flagsState: Object.keys(featureFlags).reduce((flagsState, flagName) => ({
      ...flagsState,
      [flagName]: {
        variation: 0,
        version: 1
      }
    }), {}),
    $valid: true
  };
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

export const routeManageOrgFeatureFlags = async (
  page: Page,
  featureFlags: FeatureFlagOverrides = {}
): Promise<void> => {
  await page.unroute('https://app.launchdarkly.com/sdk/evalx/**');
  await page.unroute('https://app.launchdarkly.com/sdk/eval/**');
  const featureFlagsResponse = buildFeatureFlagsResponse(featureFlags);

  await page.route('https://app.launchdarkly.com/sdk/evalx/**', async (route) =>
    fulfillJson(route, featureFlagsResponse)
  );

  await page.route('https://app.launchdarkly.com/sdk/eval/**', async (route) =>
    fulfillJson(route, featureFlagsResponse)
  );
};

export const setupManageOrgBaseRoutes = async (
  page: Page,
  options: SetupManageOrgBaseRoutesOptions = {}
): Promise<void> => {
  await routeManageOrgFeatureFlags(page, options.featureFlags);

  await page.route('https://events.launchdarkly.com/**', async (route) =>
    route.fulfill({ status: 202, body: '' })
  );

  await page.route('**/external/configuration-ui/**', async (route) =>
    fulfillJson(route, {
      ...manageOrgRuntimeConfiguration,
      ...options.runtimeConfiguration
    })
  );

  await page.route('**/auth/isAuthenticated', async (route) => fulfillJson(route, true));

  await page.route('**/api/user/details**', async (route) =>
    fulfillJson(route, manageOrgIntegrationUserDetails)
  );

  await page.route('**/api/healthCheck**', async (route) =>
    fulfillJson(route, { healthState: true })
  );

  await page.route('**/api/organisation**', async (route) =>
    fulfillJson(route, options.organisation ?? manageOrgIntegrationOrganisation)
  );

  await page.route('**/api/allUserListWithoutRoles**', async (route) =>
    fulfillJson(route, options.usersWithoutRolesResponse ?? manageOrgUsersWithoutRolesResponse)
  );
};
