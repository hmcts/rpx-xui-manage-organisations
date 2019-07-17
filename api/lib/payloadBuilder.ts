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

// should take in a string, or null
// returns a string
// if null return empty string
function notNullOrUndefined(fieldMapping, value) {
  if (value) {
    return value;
  }
  if (fieldMapping == 'pbaAccounts' && value === null) {
    console.log('null', value)
    return 'PBA1234567678';
  }
  if (fieldMapping == 'sraId' && value == undefined) {
    console.log('undefined', value)
    return 'sraTempNumber';
  }
  if (fieldMapping == 'dxExchange' && value == null) {
    console.log('null', value)
    return '12345678901234567890';
  }
  if (fieldMapping == 'dxNumber' && value == null) {
    console.log('null', value)
    return '1234567890123';
  }
}

function setPropertyIfNotNull(organisationPayload, propertyName, value) {
  if (value != null) {
    console.log(value + 'not null, adding')
    organisationPayload[propertyName] =
      value
  }
}

function setPBAPropertiesIfNotNull(organisationPayload, propertyName1, propertyName2, value1, value2) {
  if (value1 != null || value2 != null) {
    console.log(value1 + value2 + 'is not null, adding')
    organisationPayload[propertyName1] = [{
      [propertyName1]: value1,
      [propertyName2]: value2
    }]
  }
}

function setDXPropertiesIfNotNull(organisationPayload, propertyName1, propertyName2, arrayName, value1, value2) {

  if (value1 != null || value2 != null) {
    console.log(value1 + 'not null, adding')
    var [contactInformationArray] = organisationPayload.contactInformation
    contactInformationArray[arrayName] = [{
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
  setPBAPropertiesIfNotNull(organisationPayload, 'pbaAccounts', 'pbaNumber', stateValues.PBAnumber1, stateValues.PBAnumber2)
  setDXPropertiesIfNotNull(organisationPayload, 'dxExchange', 'dxNumber', 'dxAddress',
    stateValues.DXexchange, stateValues.DXnumber)

  console.log('organisation payload is', organisationPayload)

  return organisationPayload;
}
