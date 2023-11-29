import { AxiosResponse } from 'axios';
import { NextFunction, Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { OrganisationUser } from '../interfaces/organisationPayload';

export async function handleOrganisationRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await req.http.get(
      `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v2/organisations`
    );
    res.send(response.data);
  } catch (error) {
    next(error);
  }
}

export function getOrganisationDetails(req: Request, url: string): Promise<AxiosResponse> {
  return req.http.get(`${url}/refdata/external/v2/organisations`);
}

// delete next two functions after register org feature not necessary
export async function handleOrganisationV1Route(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await req.http.get(
      `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations`
    );
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
    console.log(req.query.currentUserEmail);
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

export default router;
