import { NextFunction, Request, Response, Router } from 'express';
import { RegistrationData, RegistrationRequest } from '../models/registrationData';
import { generateS2sToken } from '../lib/s2sTokenGeneration';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH, SERVICE_S2S_PATH } from '../configuration/references';
import { http } from '../lib/http';

export function mapRequestObject(requestBody: RegistrationData): RegistrationRequest {
  const request: RegistrationRequest = {
    name: requestBody.companyName,
    companyNumber: requestBody.companyHouseNumber,
    superUser: {
      firstName: requestBody.contactDetails.firstName,
      lastName: requestBody.contactDetails.lastName,
      email: requestBody.contactDetails.workEmailAddress
    },
    paymentAccount: requestBody.pbaNumbers,
    contactInformation: [
      {
        addressLine1: requestBody.address.addressLine1,
        addressLine2: convertEmptyStringToNull(requestBody.address.addressLine2),
        addressLine3: convertEmptyStringToNull(requestBody.address.addressLine3),
        townCity: requestBody.address.postTown,
        county: requestBody.address.county,
        country: requestBody.address.country,
        postCode: requestBody.address.postCode,
        dxAddress: getDx(requestBody)
      }
    ],
    orgType: requestBody.organisationType.key
  };
  return request;
}

export const router = Router({ mergeParams: true });

function getDx(requestBody: RegistrationData): [{ dxNumber: string; dxExchange: string; }] {
  const dxNumber = convertEmptyStringToNull(requestBody.dxNumber);
  const dxExchange = convertEmptyStringToNull(requestBody.dxExchange);
  if (dxNumber && dxExchange) {
    return [{
      dxNumber,
      dxExchange
    }];
  }
  return null;
}

export async function handleRegisterOrgRoute(req: Request, res: Response, next: NextFunction): Promise<any> {
  const registerPayload = req.body as RegistrationData;

  const s2sServicePath = getConfigValue(SERVICE_S2S_PATH);

  const s2sToken = await generateS2sToken(s2sServicePath);
  const rdProfessionalPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
  /**
   * We use the S2S token to set the headers.
   */
  const url = `${rdProfessionalPath}/refdata/external/v2/organisations`;
  const options = {
    headers: { ServiceAuthorization: `Bearer ${s2sToken}` }
  };
  const axiosInstance = http({} as unknown as Request);
  try {
    const registerRequest = mapRequestObject(registerPayload);
    const response = await axiosInstance.post(url, registerRequest, options);
    res.send(response.data);
  } catch (error) {
    next(error);
  }
}

router.post('/register', handleRegisterOrgRoute);

export default router;

function convertEmptyStringToNull(term: string): string {
  return term === '' ? null : term;
}

