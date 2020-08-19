import { AxiosResponse } from 'axios'
import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { OrganisationUser } from '../interfaces/organisationPayload'
import { http } from '../lib/http'

export async function handleOrganisationRoute(req: Request, res: Response) {
    try {
        const response = await req.http.get(
          `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations`
        )
        res.send(response.data)
    } catch (error) {
        const errReport = {
            apiError: error.data.message,
            apiStatusCode: error.status,
            message: 'Organisation route error',
        }
        res.status(errReport.apiStatusCode).send(errReport)
    }
}

export function getOrganisationDetails(jwt: string, roles: string[], url: string): Promise<AxiosResponse> {
    const axiosInstance = http({
        session: {
          auth: {
            roles,
            token: jwt,
          },
        },
      } as any)

    return axiosInstance.get(`${url}/refdata/external/v1/organisations`)
}

export async function handleOrganisationUsersRoute(req: Request, res: Response) {
  try {
      const response = await req.http.get(
        `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations/users?returnRoles=false`
      )
      console.log(req.query.currentUserEmail)
      res.send(getFilteredUsers(response.data.users, req.query.currentUserEmail))
  } catch (error) {
    console.log(error)
    const errReport = {
        apiError: error.data.message,
        apiStatusCode: error.status,
        message: 'Organisation route error',
    }
    res.status(errReport.apiStatusCode).send(errReport)
  }
}

function getFilteredUsers(users: OrganisationUser [], currentUserEmail: any): OrganisationUser [] {
  return users.filter(user => user.email !== currentUserEmail && user.idamStatus === 'ACTIVE')
}

export const router = Router({ mergeParams: true })

router.get('', handleOrganisationRoute)

router.get('/users', handleOrganisationUsersRoute)

export default router
