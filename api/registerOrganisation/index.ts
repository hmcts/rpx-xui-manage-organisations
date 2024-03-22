import { NextFunction, Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH, SERVICE_S2S_PATH } from '../configuration/references';
import { http } from '../lib/http';
import { generateS2sToken } from '../lib/s2sTokenGeneration';
import { RegistrationData, RegistrationRequest } from '../models/registrationData';

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
    orgType: requestBody.otherOrganisationType ? requestBody.otherOrganisationType.key : requestBody.organisationType.key,
    orgAttributes: [
      ...requestBody.services.filter((service) => service.key !== undefined)
    ]
  };
  if (requestBody.otherServices && requestBody.otherServices !== '') {
    request.orgAttributes.push({
      key: 'otherServices',
      value: requestBody.otherServices
    });
  }
  if (requestBody.regulators?.length > 0) {
    requestBody.regulators.map((regulator, index) => {
      request.orgAttributes.push({
        key: `regulators-${index}`,
        value: JSON.stringify(regulator)
      });
    });
  }
  if (requestBody.individualRegulators?.length > 0) {
    requestBody.individualRegulators.map((iRegulator, index) => {
      request.orgAttributes.push({
        key: `individualRegulators-${index}`,
        value: JSON.stringify(iRegulator)
      });
    });
  }
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
    if (error.status === 400 && error.data?.errorDescription) {
      error.data.errorDescription = securePbaNumberErrorMessage(error.data?.errorMessage) ? 'Registration cannot be completed' : error.data.errorDescription;
  
      res.status(400).send(error.data);
    } else {
      next(error);
    }
  }
}

router.post('/register', handleRegisterOrgRoute);

export default router;

function convertEmptyStringToNull(term: string): string {
  return term === '' ? null : term;
}

function securePbaNumberErrorMessage(data: string): boolean {
  const pbaNumberErrorMessage = '6 : PBA_NUMBER Invalid or already exists';
  return data.toLowerCase() === pbaNumberErrorMessage.toLowerCase();
}
