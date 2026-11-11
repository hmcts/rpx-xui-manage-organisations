import { AxiosResponse } from 'axios';
import { NextFunction, Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { OrganisationUser } from '../interfaces/organisationPayload';
import * as log4jui from '../lib/log4jui';
import { objectContainsOnlySafeCharacters } from '../lib/util';
import { EnhancedRequest } from '../models/enhanced-request.interface';

const logger = log4jui.getLogger('organisation');
const contactInformationFieldLimits = {
  uprn: 14,
  addressLine1: 150,
  addressLine2: 150,
  addressLine3: 50,
  townCity: 50,
  county: 50,
  country: 50,
  postCode: 14,
  dxNumber: 13,
  dxExchange: 40
};

// TODO - Add proper API
/* export async function handleUpdateContactInformationRoute(req: EnhancedRequest, res: Response, next: NextFunction) {
  const auth = req.session?.auth;
  if (!auth) {
    return res.status(401).send({ message: 'Authentication required' });
  }
  if (!Array.isArray(auth.roles) || !auth.roles.includes('pui-organisation-manager')) {
    return res.status(403).send({ message: 'Organisation manager role required' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)
    || typeof body.addressLine1 !== 'string' || !body.addressLine1.trim()
    || Object.entries(body).some(([field, value]) => !Object.prototype.hasOwnProperty.call(contactInformationFieldLimits, field)
      || typeof value !== 'string' || !value.trim() || value.length > contactInformationFieldLimits[field])
    || Boolean(body.dxNumber) !== Boolean(body.dxExchange)) {
    return res.status(400).send({ message: 'Invalid contact information' });
  }

  try {
    const apiUrl = `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v2/organisations/contactinformation`;
    const response = await req.http.put(apiUrl, body);
    if (response.status !== 204) {
      return next({ status: 502, data: { message: 'Unexpected organisation update response' } });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error?.status ? { status: error.status, data: error.data }
      : { status: 502, data: { message: 'Organisation update service unavailable' } });
  }
} */

export async function handleOrganisationRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const apiUrl = `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v2/organisations`;
    const response = await req.http.get(apiUrl);
    if (!objectContainsOnlySafeCharacters(response.data)) {
      return res.status(400).send('Invalid organisation data');
    }
    res.send(response.data);
  } catch (error) {
    next(error);
  }
}

export function getOrganisationDetails(req: Request, url: string): Promise<AxiosResponse> {
  // set to v1 as feature toggling on this would be difficult
  // only necessary for auth to get org id so setting to v1 until v2 in wide use on PROD
  return req.http.get(`${url}/refdata/external/v1/organisations`);
}

// delete next two functions after register org feature not necessary
export async function handleOrganisationV1Route(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await req.http.get(
      `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations`
    );
    if (!objectContainsOnlySafeCharacters(response.data)) {
      return res.status(400).send('Invalid organisation data');
    }
    res.send(response.data);
  } catch (error) {
    next(error);
  }
}

export async function handleOrganisationUsersRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await req.http.get(
      `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations/users?returnRoles=false`
    );
    logger.info('Organisation users retrieved', {
      currentUserEmailProvided: Boolean(req.query.currentUserEmail),
      userCount: response.data && response.data.users ? response.data.users.length : 0
    });
    res.send(getFilteredUsers(response.data.users));
  } catch (error) {
    next(error);
  }
}

function getFilteredUsers(users: OrganisationUser []): OrganisationUser [] {
  return users.filter((user) => user.idamStatus === 'ACTIVE');
}

export const router = Router({ mergeParams: true });

router.get('/v1', handleOrganisationV1Route);

router.get('', handleOrganisationRoute);

router.get('/users', handleOrganisationUsersRoute);

// router.put('/contact-information', handleUpdateContactInformationRoute);

export default router;
