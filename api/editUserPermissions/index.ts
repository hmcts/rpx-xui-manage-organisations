import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { ErrorReport } from '../interfaces/errorReport';
import { PermissionsUpdate } from '../interfaces/permissionsUpdate';
import * as log4jui from '../lib/log4jui';
import { getRefdataUserDetailsUrl } from '../user-details';

export const router = Router({ mergeParams: true });
const logger = log4jui.getLogger('outgoing');

router.put('', inviteUserRoute);

export async function inviteUserRoute(req: Request<{ userId: string }>, res: Response) {
  let errReport: ErrorReport;
  if (!req.params.userId) {
    errReport = getErrorReport('UserId is missing', '400', 'User Permissions route error');
    res.status(400).send(errReport);
    return;
  }
  try {
    const payload = await buildPermissionsUpdate(req);
    const response = await req.http.put(getEditPermissionsUrl(getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH), req.params.userId), payload);
    logger.info('Edit user permissions response', {
      rolesAdded: getRoleNames(payload.rolesAdd),
      rolesRemoved: getRoleNames(payload.rolesDelete),
      response: getEditPermissionsResponseSummary(response.data),
      userId: req.params.userId
    });

    res.send(response.data);
  } catch (error) {
    logger.info('error', error);
    const status = error.status ? error.status : 500;
    errReport = getErrorReport(getErrorMessage(error), status, getErrorMessage(error));
    res.status(status).send(errReport);
  }
}

export async function ogdEditUserRoute(req: Request<{ userId: string }>) {
  let ogdErrReport: ErrorReport;
  if (!req.params.userId) {
    ogdErrReport = getErrorReport('UserId is missing', '400', 'User Permissions route error');
    throw (ogdErrReport);
  }
  try {
    const payload = await buildPermissionsUpdate(req);
    const response = await req.http.put(getEditPermissionsUrl(getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH), req.params.userId), payload);
    logger.info('Edit user permissions response', {
      rolesAdded: getRoleNames(payload.rolesAdd),
      rolesRemoved: getRoleNames(payload.rolesDelete),
      response: getEditPermissionsResponseSummary(response.data),
      userId: req.params.userId
    });

    return (response.data);
  } catch (error) {
    logger.info('error', error);
    const ogdEditStatus = error.status ? error.status : 500;
    ogdErrReport = getErrorReport(getErrorMessage(error), ogdEditStatus, getErrorMessage(error));
    throw (ogdErrReport);
  }
}

function getErrorMessage(error: any): string {
  return error?.data ? error.data.message : '';
}
function getErrorReport(apiError: string, apiStatusCode: string = '500', message: string = ''): ErrorReport {
  return {
    apiError,
    apiStatusCode,
    message
  };
}
function getEditPermissionsUrl(rdProfessionalApiUrl: string, userId: string): string {
  return `${rdProfessionalApiUrl}/refdata/external/v1/organisations/users/${userId}`;
}

function getRoleNames(roles: any[]): string[] {
  return Array.isArray(roles) ? roles.map((role) => role.name).filter(Boolean) : [];
}

function getEditPermissionsResponseSummary(responseData: any): any {
  return {
    roleAddition: getIdamResponseSummary(responseData && responseData.roleAdditionResponse),
    roleDeletion: Array.isArray(responseData && responseData.roleDeletionResponse)
      ? responseData.roleDeletionResponse.map(getRoleDeletionResponseSummary)
      : null,
    statusUpdate: getIdamResponseSummary(responseData && responseData.statusUpdateResponse)
  };
}

function getIdamResponseSummary(response: any): any {
  return response ? {
    message: response.idamMessage,
    statusCode: response.idamStatusCode
  } : null;
}

function getRoleDeletionResponseSummary(response: any): any {
  return {
    message: response.idamMessage,
    roleName: response.roleName,
    statusCode: response.idamStatusCode
  };
}

export default router;

// Personal details are required by the downstream update contract, but are not
// editable in this workflow. Never take them from the browser's request body.
async function buildPermissionsUpdate(req: Request<{ userId: string }>) {
  const userId = req.params.userId;
  const response = await req.http.get(getRefdataUserDetailsUrl(
    getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH), encodeURIComponent(userId)
  ));
  const users = response.data?.users;
  const matches = Array.isArray(users) ? users.filter((user) => user.userIdentifier === userId) : [];
  if (matches.length !== 1) {
    throw { status: 404, data: { message: 'User not found' } };
  }
  const user = matches[0];
  if (['email', 'firstName', 'lastName', 'idamStatus'].some((field) => typeof user[field] !== 'string')) {
    throw { status: 502, data: { message: 'Invalid user details response' } };
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw { status: 400, data: { message: 'Invalid permissions update' } };
  }
  const payload: PermissionsUpdate = {
    id: userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    idamStatus: user.idamStatus
  };
  for (const field of ['rolesAdd', 'rolesDelete']) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      if (!Array.isArray(body[field]) || body[field].some((role) => !role || typeof role.name !== 'string')) {
        throw { status: 400, data: { message: 'Invalid role changes' } };
      }
      payload[field] = body[field].map((role) => ({ name: role.name }));
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'userAccessTypes')) {
    if (!Array.isArray(body.userAccessTypes) || body.userAccessTypes.some((access) => !access
      || ['jurisdictionId', 'organisationProfileId', 'accessTypeId'].some((field) => typeof access[field] !== 'string')
      || typeof access.enabled !== 'boolean')) {
      throw { status: 400, data: { message: 'Invalid user access types' } };
    }
    payload.userAccessTypes = body.userAccessTypes.map((access) => ({
      jurisdictionId: access.jurisdictionId,
      organisationProfileId: access.organisationProfileId,
      accessTypeId: access.accessTypeId,
      enabled: access.enabled
    }));
  }
  return payload;
}
