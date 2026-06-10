import type { Page } from '@playwright/test';
import { manageOrgRuntimeConfiguration } from '../mocks/manageOrgIntegration.mock';
import { fulfillJson } from './manageOrgBaseRoutes.helper';

interface TermsAndConditionsRouteOptions {
  hasAcceptedTerms?: boolean;
}

export interface TermsAndConditionsRouteState {
  acceptTermsRequests: Array<{ method: string; userId: string | undefined }>;
  userTermsStatusRequests: Array<{ method: string; userId: string }>;
}

export const setupTermsAndConditionsRoutes = async (
  page: Page,
  options: TermsAndConditionsRouteOptions = {}
): Promise<TermsAndConditionsRouteState> => {
  const routeState: TermsAndConditionsRouteState = {
    acceptTermsRequests: [],
    userTermsStatusRequests: []
  };

  await page.unroute('**/external/configuration-ui/**');
  await page.unroute('**/api/userTermsAndConditions');
  await page.unroute('**/api/userTermsAndConditions/**');

  await page.route('**/external/configuration-ui/**', async (route) =>
    fulfillJson(route, {
      ...manageOrgRuntimeConfiguration,
      termsAndConditionsEnabled: true
    })
  );

  await page.route('**/api/userTermsAndConditions', async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      await fulfillJson(route, { error: 'Expected POST request' }, 405);
      return;
    }

    const postData = request.postDataJSON() as { userId?: string } | undefined;

    routeState.acceptTermsRequests.push({
      method: request.method(),
      userId: postData?.userId
    });

    await fulfillJson(route, { userId: postData?.userId });
  });

  await page.route('**/api/userTermsAndConditions/**', async (route) => {
    const request = route.request();
    const userId = new URL(request.url()).pathname.split('/').pop() ?? '';

    routeState.userTermsStatusRequests.push({
      method: request.method(),
      userId
    });

    if (request.method() !== 'GET') {
      await fulfillJson(route, { error: 'Expected GET request' }, 405);
      return;
    }

    await fulfillJson(route, options.hasAcceptedTerms ?? false);
  });

  return routeState;
};
