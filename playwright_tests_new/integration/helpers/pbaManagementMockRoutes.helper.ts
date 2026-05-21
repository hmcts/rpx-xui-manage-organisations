import type { Page, Route } from '@playwright/test';
import {
  pbaFinanceUserDetails,
  pbaManagementOrganisation,
  pbaUpdateSuccessResponse
} from '../mocks/pbaManagement.mock';
import { fulfillJson } from './manageOrgBaseRoutes.helper';

interface PbaManagementOrganisation {
  paymentAccount: string[];
  pendingPaymentAccount: string[];
  response?: typeof pbaUpdateSuccessResponse;
  [key: string]: unknown;
}

export interface PbaManagementUpdateRequest {
  pendingPaymentAccount: {
    pendingAddPaymentAccount: string[];
    pendingRemovePaymentAccount: string[];
  };
}

export interface CapturedPbaManagementUpdateRequest extends PbaManagementUpdateRequest {
  method: string;
}

export interface PbaManagementRouteState {
  organisationRequests: string[];
  updatePbaRequests: CapturedPbaManagementUpdateRequest[];
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

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

const applySuccessfulPbaUpdate = (
  organisation: PbaManagementOrganisation,
  updateRequest: PbaManagementUpdateRequest
): PbaManagementOrganisation => {
  const { pendingAddPaymentAccount, pendingRemovePaymentAccount } = updateRequest.pendingPaymentAccount;
  const accountsToRemove = new Set(pendingRemovePaymentAccount);

  return {
    ...organisation,
    response: pbaUpdateSuccessResponse,
    paymentAccount: organisation.paymentAccount.filter((account) => !accountsToRemove.has(account)),
    pendingPaymentAccount: [
      ...organisation.pendingPaymentAccount,
      ...pendingAddPaymentAccount
    ]
  };
};

export const setupPbaManagementRoutes = async (page: Page): Promise<PbaManagementRouteState> => {
  const routeState: PbaManagementRouteState = {
    organisationRequests: [],
    updatePbaRequests: []
  };
  let organisation = clone(pbaManagementOrganisation) as PbaManagementOrganisation;

  await page.unroute('**/api/user/details**');
  await page.route('**/api/user/details**', async (route) => fulfillJson(route, pbaFinanceUserDetails));

  await page.unroute('**/api/organisation**');
  await page.route('**/api/organisation**', async (route) => {
    routeState.organisationRequests.push(route.request().method());

    if (await rejectUnexpectedMethod(route, 'GET')) {
      return;
    }

    await fulfillJson(route, organisation);
  });

  await page.route('**/api/pba/addDeletePBA', async (route) => {
    if (await rejectUnexpectedMethod(route, 'POST')) {
      return;
    }

    const request = route.request();
    const updateRequest = request.postDataJSON() as PbaManagementUpdateRequest;

    routeState.updatePbaRequests.push({
      ...updateRequest,
      method: request.method()
    });
    organisation = applySuccessfulPbaUpdate(organisation, updateRequest);

    await fulfillJson(route, pbaUpdateSuccessResponse);
  });

  return routeState;
};
