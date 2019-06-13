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

// The hardcoded values need to be replaced with dynamic functionality

export function makeOrganisationPayload(stateValues): OrganisationPayload {
    return {
      // hardcoded value for dev purpose
      companyNumber: '12345678',
      // hardcoded value for dev purpose
      companyUrl: 'comp-url1',
      contactInformation: [
        {
          addressLine1: stateValues.officeAddressOne,
          addressLine2: stateValues.officeAddressTwo,
          // hardcoded value for dev purpose
          addressLine3: 'This needs to be clarified',
          // hardcoded value for dev purpose
          country: 'Test Country Name - UK',
          county: stateValues.county,
        postcode: stateValues.postcode,
        townCity: stateValues.townOrCity,
          dxAddress: [
            {
              // hardcoded value for dev purpose
              dxExchange: 'dxexchange1',
              // hardcoded value for dev purpose
              dxNumber: 'DX 1234567890',
            },
          ],
      }
      ],
      name: stateValues.orgName,
      pbaAccounts: [
        {
          pbaAccounts: stateValues.PBAnumber1,
          pbaNumber: stateValues.PBAnumber2,
          },
      ],
      // hardcoded value for dev purpose
      sraId: 'sraId123',
      sraRegulated: true,
      superUser: {
          email: stateValues.emailAddress,
          firstName: stateValues.firstName,
          lastName: stateValues.lastName,
      },
    }
}
