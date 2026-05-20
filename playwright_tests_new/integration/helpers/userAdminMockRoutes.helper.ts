import type { Page, Route } from '@playwright/test';
import {
  userAdminJurisdictionsResponse,
  userAdminUsersWithoutRolesResponse
} from '../mocks/userAdmin.mock';
import { fulfillJson } from './manageOrgBaseRoutes.helper';

export interface InviteUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  resendInvite: boolean;
  roles: string[];
}

export interface CapturedInviteUserRequest extends InviteUserRequest {
  method: string;
}

export interface UserAdminRouteState {
  inviteUserRequests: CapturedInviteUserRequest[];
  jurisdictionRequests: string[];
  userListRequests: string[];
}

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

export const setupUserAdminRoutes = async (page: Page): Promise<UserAdminRouteState> => {
  const routeState: UserAdminRouteState = {
    inviteUserRequests: [],
    jurisdictionRequests: [],
    userListRequests: []
  };

  await page.unroute('**/api/allUserListWithoutRoles**');

  await page.route('**/api/allUserListWithoutRoles**', async (route) => {
    routeState.userListRequests.push(route.request().method());

    if (await rejectUnexpectedMethod(route, 'GET')) {
      return;
    }

    await fulfillJson(route, userAdminUsersWithoutRolesResponse);
  });

  await page.route('**/api/jurisdictions', async (route) => {
    routeState.jurisdictionRequests.push(route.request().method());

    if (await rejectUnexpectedMethod(route, 'GET')) {
      return;
    }

    await fulfillJson(route, userAdminJurisdictionsResponse);
  });

  await page.route('**/api/inviteUser', async (route) => {
    if (await rejectUnexpectedMethod(route, 'POST')) {
      return;
    }

    const request = route.request();

    routeState.inviteUserRequests.push({
      ...(request.postDataJSON() as InviteUserRequest),
      method: request.method()
    });

    await fulfillJson(route, { idamId: 'invited-user-id' });
  });

  return routeState;
};
