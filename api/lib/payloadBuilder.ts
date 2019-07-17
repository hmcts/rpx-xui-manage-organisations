import { OrganisationPayload } from '../interfaces/organisationPayload'

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

function setPropertyIfNotNull(organisationPayload, propertyName, value) {
  if (value != null) {
    organisationPayload[propertyName] =
      value
  }
}

function setPropertiesIfNotNull(organisationPayload, propertyName1, propertyName2, arrayName, value1, value2) {
  if (value1 != null || value2 != null) {
    organisationPayload[arrayName] = [{
      [propertyName1]: value1,
      [propertyName2]: value2
    }]
  }
}

export function makeOrganisationPayload(stateValues): any {

  const organisationPayload = {
    contactInformation: [
      {
        addressLine1: stateValues.officeAddressOne,
        addressLine2: stateValues.officeAddressTwo,
        county: stateValues.county,
        postcode: stateValues.postcode,
        townCity: stateValues.townOrCity
      },
    ],
    name: stateValues.orgName,
    superUser: {
      email: stateValues.emailAddress,
      firstName: stateValues.firstName,
      lastName: stateValues.lastName,
    },
  }

  setPropertyIfNotNull(organisationPayload, 'sraId', stateValues.sraNumber)
  setPropertiesIfNotNull(organisationPayload, 'pbaAccounts', 'pbaNumber', 'pbaAccounts', stateValues.PBAnumber1, stateValues.PBAnumber2)

  var [contactInformationArray] = organisationPayload.contactInformation
  setPropertiesIfNotNull(contactInformationArray, 'dxExchange', 'dxNumber', 'dxAddress',
    stateValues.DXexchange, stateValues.DXnumber)

  return organisationPayload;
}
