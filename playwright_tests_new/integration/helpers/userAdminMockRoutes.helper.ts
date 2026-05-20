import type { Page, Route } from '@playwright/test';
import {
  editUserPermissionsSuccessResponse,
  userAdminActiveUser,
  userAdminActiveUserDetails,
  userAdminJurisdictionsResponse,
  userAdminPendingUser,
  userAdminPendingUserDetails,
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

export interface EditUserPermissionsRequest {
  email: string;
  firstName: string;
  lastName: string;
  idamStatus: string;
  rolesAdd: { name: string }[];
  rolesDelete: { name: string }[];
}

export interface CapturedEditUserPermissionsRequest extends EditUserPermissionsRequest {
  method: string;
  userId: string;
}

export interface CapturedSuspendUserRequest {
  method: string;
  userId: string;
  userIdentifier: string;
  firstName: string;
  lastName: string;
  email: string;
  idamStatus: string;
}

export interface UserAdminRouteState {
  allUserListRequests: string[];
  editUserPermissionRequests: CapturedEditUserPermissionsRequest[];
  inviteUserRequests: CapturedInviteUserRequest[];
  jurisdictionRequests: string[];
  suspendUserRequests: CapturedSuspendUserRequest[];
  userDetailsRequests: { method: string; userId: string | null }[];
  userListRequests: string[];
}

const rejectUnexpectedMethod = async (
  route: Route,
  expectedMethod: 'GET' | 'POST' | 'PUT'
): Promise<boolean> => {
  const method = route.request().method();

  if (method === expectedMethod) {
    return false;
  }

  await fulfillJson(route, { error: `Expected ${expectedMethod} request` }, 405);
  return true;
};

const userDetailsById = new Map([
  [userAdminActiveUser.userIdentifier, userAdminActiveUserDetails],
  [userAdminPendingUser.userIdentifier, userAdminPendingUserDetails]
]);

const pathSegmentAfter = (requestUrl: string, segment: string): string => {
  const segments = new URL(requestUrl).pathname.split('/');
  const segmentIndex = segments.findIndex((pathSegment) => pathSegment === segment);
  return segmentIndex === -1 ? '' : segments[segmentIndex + 1] ?? '';
};

export const setupUserAdminRoutes = async (page: Page): Promise<UserAdminRouteState> => {
  const routeState: UserAdminRouteState = {
    allUserListRequests: [],
    editUserPermissionRequests: [],
    inviteUserRequests: [],
    jurisdictionRequests: [],
    suspendUserRequests: [],
    userDetailsRequests: [],
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

  await page.route('**/api/allUserList', async (route) => {
    routeState.allUserListRequests.push(route.request().method());

    if (await rejectUnexpectedMethod(route, 'GET')) {
      return;
    }

    await fulfillJson(route, userAdminUsersWithoutRolesResponse);
  });

  await page.route('**/api/user-details**', async (route) => {
    const request = route.request();
    const userId = new URL(request.url()).searchParams.get('userId');

    routeState.userDetailsRequests.push({
      method: request.method(),
      userId
    });

    if (await rejectUnexpectedMethod(route, 'GET')) {
      return;
    }

    const userDetails = userId ? userDetailsById.get(userId) : undefined;
    await fulfillJson(route, {
      users: userDetails ? [userDetails] : []
    });
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

  await page.route('**/api/editUserPermissions/users/**', async (route) => {
    if (await rejectUnexpectedMethod(route, 'PUT')) {
      return;
    }

    const request = route.request();
    const editRequest = request.postDataJSON() as EditUserPermissionsRequest;

    routeState.editUserPermissionRequests.push({
      ...editRequest,
      method: request.method(),
      userId: pathSegmentAfter(request.url(), 'users')
    });

    await fulfillJson(route, editUserPermissionsSuccessResponse);
  });

  await page.route('**/api/user/*/suspend', async (route) => {
    if (await rejectUnexpectedMethod(route, 'PUT')) {
      return;
    }

    const request = route.request();
    const suspendRequest = request.postDataJSON() as CapturedSuspendUserRequest;

    routeState.suspendUserRequests.push({
      ...suspendRequest,
      method: request.method(),
      userId: pathSegmentAfter(request.url(), 'user')
    });

    await fulfillJson(route, {});
  });

  return routeState;
};
