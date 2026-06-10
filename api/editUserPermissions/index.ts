import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { ErrorReport } from '../interfaces/errorReport';
import * as log4jui from '../lib/log4jui';

export const router = Router({ mergeParams: true });
const logger = log4jui.getLogger('outgoing');

router.put('', inviteUserRoute);

async function inviteUserRoute(req: Request, res: Response) {
  let errReport: ErrorReport;
  if (!req.params.userId) {
    errReport = getErrorReport('UserId is missing', '400', 'User Permissions route error');
    res.status(400).send(errReport);
    return;
  }
  const payload = req.body;
  try {
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

export async function ogdEditUserRoute(req: Request) {
  let ogdErrReport: ErrorReport;
  if (!req.params.userId) {
    ogdErrReport = getErrorReport('UserId is missing', '400', 'User Permissions route error');
    throw (ogdErrReport);
  }
  const payload = req.body;
  try {
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
  return error && error.data ? error.data.message : '';
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
