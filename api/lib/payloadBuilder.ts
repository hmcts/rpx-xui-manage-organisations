import {OrganisationPayload} from '../interfaces/organisationPayload'

/**
 * makeOrganisationPayload
 *
 * Constructs payload to POST data to the /organisations endpoint.
 *
 * TODO: Note that if we add the dxAddress in, we get a 500 status error.
 * Fix required on the api. Awaiting fix. JIRA ticket raised: PUID-103
 *
 * @param stateValues
 * @return
 */

// TODO make this dynamic so if property does not have value it doesn't get set

export function makeOrganisationPayload(stateValues): OrganisationPayload {
    return {
      contactInformation: [
        {
          addressLine1: stateValues.officeAddressOne,
          addressLine2: stateValues.officeAddressTwo,
          county: stateValues.county,
          postcode: stateValues.postcode,
          townCity: stateValues.townOrCity,
          dxAddress: [
            {
              dxExchange: stateValues.DXexchange,
              dxNumber: stateValues.DXnumber,
            },
          ],
        },
      ],
      name: stateValues.orgName,
      pbaAccounts: [
        {
          pbaAccounts: stateValues.PBAnumber1,
          pbaNumber: stateValues.PBAnumber2,
          },
      ],
      sraId: stateValues.sraNumber,
      superUser: {
          email: stateValues.emailAddress,
          firstName: stateValues.firstName,
          lastName: stateValues.lastName,
      },
    }
}
