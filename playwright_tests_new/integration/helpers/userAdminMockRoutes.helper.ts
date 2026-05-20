import type { Page } from '@playwright/test';
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

export interface UserAdminRouteState {
  inviteUserRequests: InviteUserRequest[];
  jurisdictionRequests: string[];
  userListRequests: string[];
}

export const setupUserAdminRoutes = async (page: Page): Promise<UserAdminRouteState> => {
  const routeState: UserAdminRouteState = {
    inviteUserRequests: [],
    jurisdictionRequests: [],
    userListRequests: []
  };

  await page.unroute('**/api/allUserListWithoutRoles**');

  await page.route('**/api/allUserListWithoutRoles**', async (route) => {
    routeState.userListRequests.push(route.request().method());

    await fulfillJson(route, userAdminUsersWithoutRolesResponse);
  });

  await page.route('**/api/jurisdictions', async (route) => {
    routeState.jurisdictionRequests.push(route.request().method());

    await fulfillJson(route, userAdminJurisdictionsResponse);
  });

  await page.route('**/api/inviteUser', async (route) => {
    routeState.inviteUserRequests.push(route.request().postDataJSON() as InviteUserRequest);

    await fulfillJson(route, { idamId: 'invited-user-id' });
  });

  return routeState;
};
