import type { Page } from '@playwright/test';
import {
  organisationTypeLovResponse,
  registrationCannotBeCompletedResponse,
  regulatoryOrganisationTypesResponse,
  RegisterOrganisationSubmission,
  successfulRegistrationResponse
} from '../mocks/registerOrganisation.mock';
import { fulfillJson } from './manageOrgBaseRoutes.helper';

interface RegisterOrganisationLovRequest {
  categoryId: string | null;
  isChildRequired: string | null;
  method: string;
  serviceId: string | null;
}

interface RegisterOrganisationResponse {
  organisationIdentifier?: string;
  status?: string;
  errorDescription?: string;
  errorMessage?: string;
}

export interface RegisterOrganisationRouteState {
  lovRequests: RegisterOrganisationLovRequest[];
  registrationRequests: RegisterOrganisationSubmission[];
  registrationResponses: RegisterOrganisationResponse[];
  regulatoryOrganisationTypeRequests: string[];
}

interface RegisterOrganisationRouteOptions {
  registrationResponse?: RegisterOrganisationResponse;
  registrationStatus?: number;
}

const routeUrl = (requestUrl: string): URL => new URL(requestUrl);

export const setupRegisterOrganisationRoutes = async (
  page: Page,
  options: RegisterOrganisationRouteOptions = {}
): Promise<RegisterOrganisationRouteState> => {
  const routeState: RegisterOrganisationRouteState = {
    lovRequests: [],
    registrationRequests: [],
    registrationResponses: [],
    regulatoryOrganisationTypeRequests: []
  };
  const registrationStatus = options.registrationStatus ?? 200;
  const registrationResponse = options.registrationResponse ??
    (registrationStatus >= 400 ? registrationCannotBeCompletedResponse : successfulRegistrationResponse);

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

  await page.route('**/external/regulatoryOrganisationTypes', async (route) => {
    routeState.regulatoryOrganisationTypeRequests.push(route.request().method());

    await fulfillJson(route, regulatoryOrganisationTypesResponse);
  });

  await page.route('**/external/register-org-new/register', async (route) => {
    const body = route.request().postDataJSON() as RegisterOrganisationSubmission;

    routeState.registrationRequests.push(body);
    routeState.registrationResponses.push(registrationResponse);

    await fulfillJson(route, registrationResponse, registrationStatus);
  });

  return routeState;
};
