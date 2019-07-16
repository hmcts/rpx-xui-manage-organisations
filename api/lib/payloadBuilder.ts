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
    return '666666666666';
  }
}

export function makeOrganisationPayload(stateValues): any {

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
            dxExchange: notNullOrUndefined('dxExchange', stateValues.DXexchange),
            dxNumber: notNullOrUndefined('dxNumber', stateValues.DXnumber),
          },
        ],
      },
    ],
    name: stateValues.orgName,
    pbaAccounts: [
      {
        pbaAccounts: notNullOrUndefined('pbaAccounts', stateValues.PBAnumber1),
        pbaNumber: notNullOrUndefined('pbaNumber', stateValues.PBAnumber2),
      },
    ],
    sraId: notNullOrUndefined('sraId', stateValues.sraNumber),
    superUser: {
      email: stateValues.emailAddress,
      firstName: stateValues.firstName,
      lastName: stateValues.lastName,
    },
  }
}
